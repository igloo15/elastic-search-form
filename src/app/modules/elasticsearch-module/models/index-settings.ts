import { ESMapping } from './mapping';

export interface ESIndexCreation {
    settings: ESIndexSettings;
    mappings: ESMapping;
}

export class ESIndexSettings {
    number_of_shards = 1;
    number_of_replicas = 1;

    constructor() {

    }
}