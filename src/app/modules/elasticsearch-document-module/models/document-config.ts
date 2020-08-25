import { TemplateRef, Type } from '@angular/core';
import { ESFieldData } from './field-data';

export interface ESDocumentConfigCollection {
    default: ESDocumentConfig;
    indexConfigs: Map<string, ESDocumentConfig>;
}

export type TitleType = string | ((model: any) => string);

export interface ESDocumentStyleConfig {
    stretch?: boolean;
    width?: string;
    height?: string;
    extraStyle?: string;
}

export interface ESFieldItemConfig {
    key: string;
    style?: ESDocumentStyleConfig;
    type?: string;
    title?: TitleType;
    disable?: boolean;
    min?: number;
    max?: number;
    interval?: number;
    verticalSlider?: boolean;
    invertedSlider?: boolean;
    sliderTooltip?: boolean;
    numOptions?: number[];
    stringOptions?: string[];
    multiSelect?: boolean;
    showTextArea?: boolean;
    textAreaMinRows?: number;
    textAreaMaxRows?: number;
    textAreaAutoSize?: boolean;
    enableStringLimit?: boolean;
    stringLimit?: number;
    showClearTextButton?: boolean;
    valueToDisplay?: (data: ESFieldData) => any;
    valueFromDisplay?: (data: any) => any;
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
    redirectToTable?: boolean;
    title?: TitleType;
    disable?: boolean;
}

export class ESDocumentRowBuilder {
    data: ESDocumentRowConfig;
    parent: ESDocumentBuilder;

    constructor(title: TitleType, parentBuilder: ESDocumentBuilder) {
        this.data = {
            title,
            columns: [],
            style: {}
        }
        this.parent = parentBuilder;
    }

    addStyle(style: ESDocumentStyleConfig): ESDocumentRowBuilder {
        this.data.style = {...this.data.style, ...style};
        return this;
    }

    addItem(item: ESFieldItemConfig): ESDocumentRowBuilder {
        this.data.columns.push(item);
        return this;
    }

    done(): ESDocumentBuilder {
        return this.parent;
    }

    build(): ESDocumentRowConfig {
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

    addStyle(style: ESDocumentStyleConfig): ESDocumentBuilder {
        this.data.style = {...this.data.style, ...style};
        return this;
    }

    addRow(title: TitleType): ESDocumentRowBuilder {
        const row = this.createRow(title);
        this.rowBuilders.push(row);
        return row;
    }

    private createRow(title: TitleType): ESDocumentRowBuilder {
        return new ESDocumentRowBuilder(title, this);
    }
}

