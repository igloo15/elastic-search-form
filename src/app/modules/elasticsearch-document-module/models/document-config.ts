import { TemplateRef, Type } from '@angular/core';
import { ESFieldData } from './field-data';


export type TitleType = string | ((model: any) => string);

export interface ESDocumentStyleConfig {
    stretch?: boolean;
    width?: string;
    height?: string;
}

export interface ESFieldItemConfig {
    key: string;
    type: string;
    style: ESDocumentStyleConfig;
    title?: TitleType;
    disable?: boolean;
}

export interface ESDocumentRowConfig {
    title?: TitleType;
    style: ESDocumentStyleConfig;
    columns: ESFieldItemConfig[];
}

export interface ESDocumentConfig {
    index: string;
    id: string;
    fields: ESDocumentRowConfig[];
    style: ESDocumentStyleConfig;
    redirect?: string;
    title?: TitleType;
    disable?: boolean;
}

export class ESDocumentRowBuilder {
    data: ESDocumentRowConfig;

    constructor(title: TitleType) {
        this.data = {
            title,
            columns: [],
            style: {}
        }
    }

    addItem(item: ESFieldItemConfig): ESDocumentRowBuilder {
        this.data.columns.push(item);
        return this;
    }

    build() {
        return this.data;
    }
}

export class ESDocumentBuilder {
    data: ESDocumentConfig;
    rowBuilders: ESDocumentRowBuilder[] = [];

    constructor(index?: string, id?: string, title?: TitleType) {
        this.data = {
            title: title ?? '',
            index,
            id,
            fields: [],
            style: {}
        }
    }

    build(): ESDocumentConfig {
        const newFields: ESDocumentRowConfig[] = [];
        this.rowBuilders.forEach(value => {
            newFields.push(value.build());
        });
        this.data.fields = [...newFields];
        return this.data;
    }

    addRow(title: TitleType): ESDocumentRowBuilder {
        const row = this.createRow(title);
        this.rowBuilders.push(row);
        return row;
    }

    private createRow(title: TitleType): ESDocumentRowBuilder {
        return new ESDocumentRowBuilder(title);
    }
}

