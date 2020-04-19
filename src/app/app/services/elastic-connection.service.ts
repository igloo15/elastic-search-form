import { Injectable, EventEmitter } from '@angular/core';
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

  public isStarted = new EventEmitter<boolean>();

  constructor() { }

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

  async searchData<T>(index: string, term: string, from?: number, to?: number): Promise<T[]> {
    const skip = from ?? 0;
    const end = to ?? 10;
    const results = await this._client.search<T>({
      index,
      from: skip,
      size: end,
      body: {
        query: {
          query_string: {
            query: term
          }
        }
      }
    });

    return results.hits.hits.map(p => p._source);
  }

  async getById<T>(index: string, id: string) : Promise<T> {
    const result = await this._client.get<T>({
      index,
      id,
      type: null
    });
    return result._source;
  }

  async getAll<T>(index: string, from?:number, to?:number): Promise<T[]> {
    const skip = from ?? 0;
    const end = to ?? 10;
    const results = await this._client.search<T>({
      index,
      from: skip,
      size: end
    });
    return results.hits.hits.map(p => p._source);
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
