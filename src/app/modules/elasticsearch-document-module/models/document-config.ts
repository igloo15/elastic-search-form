import { TemplateRef, Type } from '@angular/core';

export interface ESField {
    data: ESFieldData;
}

export interface ESFieldData {
    type: string;
    disabled: boolean;
    customConfig?: ESCustomFieldConfig;
    model: any;
    label: string;
    key: string[];
}


export interface ESFieldDefinition {
    type: string;
    template: Type<any>;
}

export interface ESCustomFieldConfig {
    [key: string]: any;
}

export interface ESFieldConfig {
    data: ESFieldData;
    template: Type<any>;
}

export class ESDocumentConfig {
    index: string;
    id: string;

    fields: ESFieldConfig[] = [];
}