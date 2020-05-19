import { SortItem } from '@igloo15/elasticsearch-angular-service';
import { TemplateRef } from '@angular/core';

export interface TableConfigCollection {
    default: TableConfig;
    indexConfigs: Map<string, TableConfig>;
}

export interface ColumnConfig {
    prop: string;
    name?: string;
    displayName?: string;
    type?: 'basic'|'array'|'object'|'link';
    minWidth?: number;
    maxWidth?: number;
    frozenLeft?: boolean;
    frozenRight?: boolean;
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

    private _showViewColumn = true;
    public get showViewColumn() {
        return this._showViewColumn;
    }
    public set showViewColumn(val: boolean) {
        this._showViewColumn = val;
        this.viewColumn.hide = !val;
        this.refreshColumns();
    }

    private _showEditColumn = true;
    public get showEditColumn() {
        return this._showEditColumn;
    }
    public set showEditColumn(val: boolean) {
        this._showEditColumn = val;
        this.editColumn.hide = !val;
        this.refreshColumns();
    }

    public offset = 0;
    public totalCount = 0;

    public showSearch = true;
    public showLimitDropDown = true;
    public showUpArrow = true;
    public showDownArrow = true;
    public showRefresh = true;
    public showConfigButton = true;
    public scrollbarH = true;
    public scrollbarV = false;

    public sortItem?: SortItem;
    public dataConverters: {[key:string]: ESDataTypeConverter} = {};
    public columns: ColumnCollection = {};
    public expandColumn: ColumnConfig = {
        prop: '',
        name: '',
        displayName: 'Expand Column',
        width: 50,
        minWidth:50,
        maxWidth:50,
        resizeable: false,
        sortable: false,
        draggable: false,
        canAutoResize: false,
        frozenLeft: false
    }

    public idColumn: ColumnConfig = {
        prop: '_id',
        name: 'Id',
        hide: false,
        type: 'basic',
        sortable: false
    }

    readonly buttonWidth = 90;

    public viewColumn: ColumnConfig = {
        prop: '',
        name: 'View',
        hide: false,
        type: 'link',
        sortable: false,
        width: this.buttonWidth,
        minWidth: this.buttonWidth,
        maxWidth: this.buttonWidth,
        frozenRight: false
    }

    public editColumn: ColumnConfig = {
        prop: '',
        name: 'Edit',
        hide: false,
        type: 'link',
        sortable: false,
        width: this.buttonWidth,
        minWidth: this.buttonWidth,
        maxWidth: this.buttonWidth,
        frozenRight: false
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