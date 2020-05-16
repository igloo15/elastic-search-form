import { SortItem } from '@igloo15/elasticsearch-angular-service';
import { TemplateRef } from '@angular/core';

export interface ColumnConfig {
    prop: string;
    name?: string;
    displayName?: string;
    type?: 'basic'|'array'|'object';
    minWidth?: number;
    width?: number;
    $$oldWidth?: number;
    resizeable?: boolean;
    draggable?: boolean;
    canAutoResize?: boolean;
    hide?: boolean;
    cellTemplate?: TemplateRef<any>;
    sortable?: boolean;
    addKeyword?: boolean;
}

export interface ESDataTypeConverter {
    dataType: string;
    template: TemplateRef<any>;
}

export interface ColumnCollection {
    [key: string]: ColumnConfig;
}


export class TableConfig {

    private _limit = 10;

    public index: string;

    public get limit() {
        return this._limit;
    }
    public set limit(val: number) {
        this._limit = val;
        this.refreshData();
    }

    private _showIdColumn = true;
    public get showIdColumn() {
        return this._showIdColumn;
    }
    public set showIdColumn(val: boolean) {
        this._showIdColumn = val;
        this.idColumn.hide = !val;
        this.refreshColumns();
    }

    private _showExpandColumn = true;
    public get showExpandColumn() {
        return this._showExpandColumn;
    }
    public set showExpandColumn(val: boolean) {
        this._showExpandColumn = val;
        this.expandColumn.hide = !val;
        this.refreshColumns();
    }

    public offset = 0;
    public totalCount = 0;

    public showSearch = true;
    public showLimitDropDown = true;
    public showRefresh = true;
    public showConfigButton = true;

    public sortItem?: SortItem;
    public dataConverters: {[key:string]: ESDataTypeConverter} = {};
    public columns: ColumnCollection = {};
    public expandColumn: ColumnConfig = {
        prop: '',
        name: '',
        displayName: 'Expand Column',
        width: 50,
        resizeable: false,
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

    toggleIdColumn: () => void = () => {};
    toggleColumn: (id: string) => void = (id: string) => {};

    refreshColumns: () => void = () => {};
    refreshData: (resetOffset?: boolean) => void = (resetOffset?: boolean) => {};

    updateMappings: () => void = () => {};

    public addColumn(column: ColumnConfig): TableConfig {
        this.columns[column.prop] = column;
        this.refreshColumns();
        return this;
    }

    public addDataTypeConverter(dataConverter: ESDataTypeConverter): TableConfig {
        this.dataConverters[dataConverter.dataType] = dataConverter;
        return this;
    }
}