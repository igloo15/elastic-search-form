import { TemplateRef, Type } from '@angular/core';
import { ESFieldData } from './field-data';


export interface ESFieldItemConfig {
    label: string;
    type: string;
}

export interface ESDocumentRowConfig {
    title: string;
    columns: ESFieldItemConfig[];
    addItem: (item: ESFieldItemConfig) => ESDocumentRowConfig;
}

class ConcreteRowConfig implements ESDocumentRowConfig {
    title = '';
    columns: ESFieldItemConfig[] = [];

    addItem(item: ESFieldItemConfig) {
        this.columns.push(item);
        return this;
    }
}

type TitleType = string | ((model: any) => string);

export class ESDocumentConfig {
    index: string;
    id: string;
    title: (model: any) => string;
    fields: ESDocumentRowConfig[] = [];

    constructor(title: TitleType) {
        if (typeof title === 'string') {
            this.title = (model: any) => title;
        } else {
            this.title = title;
        }
    }

    getTitle(model: any) {
        return this.title(model);
    }

    addRow(): ESDocumentRowConfig {
        const row = this.createRow();
        this.fields.push(row);
        return row;
    }

    private createRow() {
        return new ConcreteRowConfig();
    }
}

