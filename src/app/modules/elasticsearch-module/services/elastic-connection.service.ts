import { Injectable, EventEmitter } from '@angular/core';
import { Client, ConfigOptions } from 'elasticsearch-browser';
import { ESMapping } from '../models/mapping';
import { ESSearchResults } from '../models/result';
import { SortItem } from '../models/sort';
import { ESIndexSettings, ESIndexCreation } from '../models/index-settings';

@Injectable({
  providedIn: 'root'
})
export class ElasticConnectionService {
  private _client: Client;
  private _options: ConfigOptions = {
    host: ''
  };

  public isStarted = new EventEmitter<boolean>();

  constructor() { }

  private isFixedString = (s: string) => !isNaN(+s) && isFinite(+s) && !/e/i.test(s);

  async start(url: string) {
    this._options.host = url;
    this._client = new Client(this._options);
    return await new Promise((resolve, reject) => {
      this._client.cat.indices({format:'json'}, (err, resp) => {
        if(err) {
          reject(err);
          this.isStarted.emit(false);
        } else {
          resolve(resp);
          this.isStarted.emit(true);
        }
      });
    });
  }

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

  async searchDataDetailed<T>(index: string, body: any, sort?: SortItem[], from?: number, to?: number): Promise<ESSearchResults<T>> {
    const skip = from ?? 0;
    const end = to ?? 10;
    let sortString = '';
    if (sort) {
      sortString = sort.map(s => `${s.field}:${s.type}`).join(',');
    }
    const results = await this._client.search<T>({
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

  async getById<T>(index: string, id: string) : Promise<T> {
    const result = await this._client.get<T>({
      index,
      id,
      type: null
    });
    return result._source;
  }

  async getAll<T>(index: string, sort?:SortItem[], from?:number, to?:number): Promise<T[]> {
    const results = await this.searchDataDetailed<T>(index, null, sort, from, to);
    return results.items;
  }

  async getCount(index: string): Promise<number> {
    const result = await this._client.count({index});
    return result.count;
  }

  async updateData<T>(index: string, data: T, id?: string) {
    await this._client.index({
      index,
      type: null,
      body: data,
      id
    });
  }

  async deleteData(index: string, id: string) {
    this._client.delete({index, id, type: null});
  }

  async getMapping(index: string) {
    const result = await this._client.indices.getMapping({index});
    return result[index].mappings as ESMapping;
  }

  async updateMapping(index: string, mapping: ESMapping) {
    return await this._client.indices.putMapping({
      index,
      type: null,
      body: mapping
    });
  }

  async indexExists(index: string) {
    return await this._client.indices.exists({index});
  }

  async flushIndex(index: string) {
    return await this._client.indices.flush({index});
  }

  async createOrUpdateIndex(index: string, config: ESIndexCreation): Promise<any> {
    const indexExistsResult = await this.indexExists(index);
    if (indexExistsResult) {
      return await this.updateMapping(index, config.mappings);
    }
    return await this.createIndex(index, config);
  }

  async createIndex(index: string, config: ESIndexCreation): Promise<any> {
    return await this._client.indices.create({
      index,
      body: config
    });
  }

  async deleteIndex(index: string): Promise<any> {
    return await this._client.indices.delete({
      index
    });
  }
}
