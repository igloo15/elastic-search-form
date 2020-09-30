import { Injectable, EventEmitter } from '@angular/core';
import { Client, ConfigOptions } from 'elasticsearch-browser';
import { ESMapping } from '../models/mapping';
import { ESSearchResults } from '../models/result';
import { SortItem } from '../models/sort';
import { ESIndexSettings, ESIndexCreation } from '../models/index-settings';
import { first } from 'rxjs/operators';

/**
 * The ElasticConnection Service
 */
@Injectable({
  providedIn: 'root'
})
export class ElasticConnectionService {
  private _client: Client;
  private _options: ConfigOptions = {
    host: ''
  };
  private _connected = false;
  /**
   * Event that is emitted when connection is started
   */
  public isStarted = new EventEmitter<boolean>();

  constructor() { }

  private isFixedString = (s: string) => !isNaN(+s) && isFinite(+s) && !/e/i.test(s);

  /**
   * Start the connection of the ElasticConnectionService
   * @param url The url to connect with
   */
  async start(url: string): Promise<boolean> {
    this._options.host = url;
    this._client = new Client(this._options);
    return await new Promise((resolve, reject) => {
      this._client.cat.indices({format:'json'}, (err, resp) => {
        if(err) {
          this._connected = false;
          reject(err);
          this.isStarted.emit(false);
        } else {
          this._connected = true;
          resolve(resp);
          this.isStarted.emit(true);
        }
      });
    });
  }

  /**
   * Get the client only returns after it started
   * @returns Returns the client asyncly after it is started
   */
  async getClient(): Promise<Client> {
    return new Promise(async (resolve, reject) => {
      if (this._connected) {
        resolve(this._client);
      } else {
        this.isStarted.pipe(first()).subscribe(() => {
          resolve(this._client);
        });
      }
    });
  }

  /**
   * Search Data does a fuzzy search on the index with the term
   * @param index The name of the index searching on
   * @param term The term to search by
   * @param sort Sort criteria
   * @param from Start number
   * @param to End Number
   */
  async searchData<T>(index: string, term: string, sort?: SortItem[], from?: number, to?: number): Promise<ESSearchResults<T>> {
    if(!this.isFixedString(term)){
      term = term+'*';
    }
    return this.searchDataDetailed<T>(index, {
      query: {
        query_string: {
          query: term
        }
      }
    }, sort, from, to);
  }

  /**
   * Search Data does a fuzzy search on the index with the term
   * @param index The name of the index searching on
   * @param body The [search request body](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-search.html)
   * @param sort Sort criteria
   * @param from Start number
   * @param to End Number
   */
  async searchDataDetailed<T>(index: string, body: any, sort?: SortItem[], from?: number, to?: number): Promise<ESSearchResults<T>> {
    const skip = from ?? 0;
    const end = to ?? 10;
    let sortString = '';
    if (sort) {
      sortString = sort.map(s => `${s.field}:${s.type}`).join(',');
    }
    const client = await this.getClient();
    const results = await client.search<T>({
      index,
      from: skip,
      size: end,
      body,
      sort: sortString
    });
    let count = 0;
    if(Number.isInteger(results.hits.total)) {
      count = results.hits.total;
    } else {
      count = (results.hits.total as any).value;
    }
    return {
      count,
      score: results.hits.max_score,
      items: results.hits.hits.map(p => { return {_id: p._id, ...p._source};})
    };
  }

  /**
   * Get item by id
   * @param index The index to search
   * @param id The id to search for
   */
  async getById<T>(index: string, id: string) : Promise<T> {
    const client = await this.getClient();
    const result = await client.get<T>({
      index,
      id,
      type: null
    });
    return result._source;
  }

  /**
   * Get all items from index
   * @param index The index to search on
   * @param sort Sort Criteria
   * @param from Start Index
   * @param to End Index
   */
  async getAll<T>(index: string, sort?:SortItem[], from?:number, to?:number): Promise<T[]> {
    const results = await this.searchDataDetailed<T>(index, null, sort, from, to);
    return results.items;
  }

  /**
   * Get the number of documents in index
   * @param index The index to query
   */
  async getCount(index: string): Promise<number> {
    const client = await this.getClient();
    const result = await client.count({index});
    return result.count;
  }

  /**
   * Update or Insert a document into index
   * @param index The index to insert document into
   * @param data The data to insert
   * @param id The optional id to use for data
   */
  async updateData<T>(index: string, data: T, id?: string): Promise<T> {
    const client = await this.getClient();
    const result: T = await client.index({
      index,
      type: null,
      body: data,
      id
    });

    return result;
  }

  /**
   * Delete a document from index returns true if successful
   * @param index The index to delete document from
   * @param id The id of documet to delete
   */
  async deleteData(index: string, id: string): Promise<boolean> {
    const client = await this.getClient();
    const result = await client.delete({index, id, type: null});
    return result.found;
  }

  /**
   * Get the Mapping of the index
   * @param index The id of index
   */
  async getMapping(index: string): Promise<ESMapping> {
    const client = await this.getClient();
    const result = await client.indices.getMapping({index});
    return result[index].mappings as ESMapping;
  }

  /**
   * Update Mapping of an index with the given mapping
   * @param index The id of index
   * @param mapping The mapping to update with
   */
  async updateMapping(index: string, mapping: ESMapping): Promise<any> {
    const client = await this.getClient();
    return await client.indices.putMapping({
      index,
      type: null,
      body: mapping
    });
  }

  /**
   * Determine if index exists in database
   * @param index The id of index
   */
  async indexExists(index: string): Promise<boolean> {
    const client = await this.getClient();
    return await client.indices.exists({index});
  }

  /**
   * Flush the given index
   * @param index The id of index
   */
  async flushIndex(index: string) {
    const client = await this.getClient();
    return await client.indices.flush({index});
  }

  /**
   * Create an index or update the mapping of the index
   * @param index The id of index
   * @param config The config used to create index
   */
  async createOrUpdateIndex(index: string, config: ESIndexCreation): Promise<any> {
    const indexExistsResult = await this.indexExists(index);
    if (indexExistsResult) {
      return await this.updateMapping(index, config.mappings);
    }
    return await this.createIndex(index, config);
  }

  /**
   * Create index with given creation settings
   * @param index The id of index
   * @param config The config used to create index
   */
  async createIndex(index: string, config: ESIndexCreation): Promise<any> {
    const client = await this.getClient();
    return await client.indices.create({
      index,
      body: config
    });
  }

  /**
   * Delete index with given id
   * @param index The id of index
   */
  async deleteIndex(index: string): Promise<any> {
    const client = await this.getClient();
    return await client.indices.delete({
      index
    });
  }
}
