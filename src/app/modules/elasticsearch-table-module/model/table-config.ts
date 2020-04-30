import { SortItem } from '@igloo15/elasticsearch-angular-service';
import { TemplateRef } from '@angular/core';

export interface ColumnConfig
{
    prop: string;
    name?: string;
    type?: 'basic'|'array'|'object';
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
    public sortItem?: SortItem;
    public columns: ColumnCollection = {};

    constructor(myIndex: string, columns?: ColumnCollection) {
        this.index = myIndex;
        this.columns = columns ? columns : {};
    }

    toggleIdColumn: () => void
    toggleColumn: (id: string) => void
}