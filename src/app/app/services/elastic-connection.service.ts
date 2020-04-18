import { Injectable } from '@angular/core';
import { Client, ConfigOptions } from 'elasticsearch-browser';
import { ESMapping } from '../models/mapping';

@Injectable({
  providedIn: 'root'
})
export class ElasticConnectionService {
  private _client: Client;
  private _options: ConfigOptions = {
    host: ''
  };

  constructor() { }

  async start(url: string) {
    this._options.host = url;
    this._client = new Client(this._options);
    return await new Promise((resolve, reject) => {
      this._client.cat.indices({format:'json'}, (err, resp) => {
        if(err) {
          reject(err);
        } else {
          resolve(resp);
        }
      });
    });
  }

  async searchData<T>(index: string, term: string, from?: number): Promise<T[]> {
    const skip = from ?? 0;
    const results = await this._client.search({
      index,
      body: {
        from: skip,
        query: {
          query_string: {
            query: term
          }
        }
      }
    });

    return results.hits.hits.map(p => p._source) as T[];
  }

  async getById<T>(index: string, id: string) : Promise<T> {
    const result = await this._client.search({
      index,
      body: {
        query: {
          ids: {
            values:[id]
          }
        }
      }
    });
    return result.hits.hits[0]._source as T;
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
}
