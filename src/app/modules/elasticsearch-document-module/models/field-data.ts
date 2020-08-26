import { Type } from '@angular/core';
import { ModelProp } from './model-data';
import { ESFieldItemConfig } from './document-config';

export interface ESFieldConfig {
    data: ESFieldData;
    template: Type<any>;
}

export interface ESFieldComponent {
    data: ESFieldData;
}

export interface ESFieldData {
    config: ESFieldItemConfig;
    model: ModelProp;
    disabled: boolean;
}

export interface ESFieldDefinition {
    type: string;
    template: Type<any>;
}

export interface ESCustomFieldConfig {
    [key: string]: any;
}