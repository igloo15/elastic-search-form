import { SortItem } from '@igloo15/elasticsearch-angular-service';
import { TemplateRef } from '@angular/core';

export interface ColumnConfig
{
    prop: string;
    name?: string;
    type?: 'basic'|'array'|'object';
    width?: number;
    resizable?: boolean;
    draggable?: boolean;
    canAutoResize?: boolean;
    hide?: boolean;
    cellTemplate?: TemplateRef<any>;
    sortable?: boolean;
    addKeyword?: boolean;
}

export interface ColumnCollection {
    [key: string]: ColumnConfig;
}


export class TableConfig {

    public index: string;
    public limit = 10;
    public offset = 0;
    public totalCount = 0;
    public showSearch = true;
    public startWithIdColumn = true;
    public startWithExpandColumn = true;
    public sortItem?: SortItem;
    public columns: ColumnCollection = {};
    public expandColumn: ColumnConfig = {
        prop: '',
        name: '',
        width: 50,
        resizable: false,
        sortable: false,
        draggable: false,
        canAutoResize: false
    }

    public idColumn: ColumnConfig = {
        prop: '_id',
        name: 'Id',
        hide: false,
        type: 'basic',
        sortable: false
    }

    constructor(myIndex: string, columns?: ColumnCollection) {
        this.index = myIndex;
        this.columns = columns ? columns : {};
    }

    toggleIdColumn: () => void
    toggleColumn: (id: string) => void
}