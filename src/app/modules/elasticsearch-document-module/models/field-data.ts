import { Type } from '@angular/core';
import { ModelProp } from './model-data';

export interface ESFieldConfig {
    data: ESFieldData;
    template: Type<any>;
}

export interface ESField {
    data: ESFieldData;
}

export interface ESFieldData {
    type: string;
    disabled: boolean;
    customConfig?: ESCustomFieldConfig;
    model: ModelProp;
    label: string;
}

export interface ESFieldDefinition {
    type: string;
    template: Type<any>;
}

export interface ESCustomFieldConfig {
    [key: string]: any;
}