import { ESMapping } from './mapping';

export interface ESIndexCreation {
    settings: ESIndexSettings;
    mappings: ESMapping;
}

export interface ESIndexSettings {
    number_of_shards?: number;
    number_of_replicas?: number;
}

export class ConcreteESIndexSettings implements ESIndexSettings {
    number_of_shards = 1;
    number_of_replicas? = 1;

    constructor() {

    }
}