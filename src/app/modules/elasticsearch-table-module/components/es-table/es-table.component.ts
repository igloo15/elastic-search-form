import { Component, OnInit, Input, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { ElasticConnectionService, ESMapping, SortItem } from '@igloo15/elasticsearch-angular-service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { IColumn } from '../../model/table-types';
import { TableConfig, ColumnConfig } from '../../model/table-config';
import { MatDialog } from '@angular/material/dialog';
import { TableConfigDialogComponent } from '../table-config-dialog/table-config-dialog.component';

@Component({
  selector: 'es-table',
  templateUrl: './es-table.component.html',
  styleUrls: ['./es-table.component.scss']
})
export class EsTableComponent implements OnInit {

  @ViewChild('arrayTmpl', { static: true }) arrayTmpl: TemplateRef<any>;
  @ViewChild('objTmpl', { static: true }) objTmpl: TemplateRef<any>;
  @ViewChild('expandTmpl', { static: true }) expandTmpl: TemplateRef<any>;
  private _dataTable: DatatableComponent;
  @ViewChild('esTable') set table(dataTable: DatatableComponent) {
    this._dataTable = dataTable;
    dataTable.columnMode = ColumnMode.force;
  }

  get table() {
    return this._dataTable;
  }

  @Input()
  public set config(val: TableConfig) {
    this._config = val;
    this.updateConfigFunction();
    this.refreshData();
  }

  public get config(): TableConfig {
    return this._config;
  }
  public ColumnMode = ColumnMode;
  public items: any[];
  public rows: any[];
  public columns: IColumn[] = [];
  public searchText: string;
  public searchTextUpdate = new Subject<any>();
  public searchScore: number;
  public loading = true;

  private _service: ElasticConnectionService;
  private _mappings: ESMapping;
  private _config: TableConfig;

  constructor(service: ElasticConnectionService, public dialog: MatDialog, private route: ActivatedRoute) {
    this._service = service;
    this.items = [];
    this.searchTextUpdate.pipe(
      debounceTime(500),
      distinctUntilChanged()
    )
    .subscribe(result => {
      this.searchText = result.target.value;
      this.refreshData(true);
    });
  }

  async ngOnInit(): Promise<void> {
    this.route.paramMap.subscribe(params => {
      if(params.get('index')) {
        this._config.index = params.get('index');
      }
      if (params.get('offset')) {
        this._config.offset = +params.get('offset');
      }
    });
    if(this._config.index) {
      this._service.isStarted.subscribe(async (result) => {
        if(result) {
          await this.startUp();
        }
      });
    }
  }

  async startUp() {
    this._mappings = await this._service.getMapping(this._config.index);
    this._config.totalCount = await this._service.getCount(this._config.index);
    this.updateMappings();
    this.refreshColumns();
    this.refreshData();
    this.loading = false;
  }

  updateConfigFunction() {
    this._config.expandColumn.cellTemplate = this.expandTmpl;
    this._config.refreshColumns = () => { this.refreshColumns(); };
    this._config.refreshData = (resetOffset?:boolean) => { this.refreshData(resetOffset); };
    this._config.toggleIdColumn = () => {
      this._config.showIdColumn = this.toggleColumn(this._config.idColumn.prop);
    }
    this._config.toggleColumn = (id: string) => {
      this.toggleColumn(id);
    }
  }

  updateMappings() {
    if(this._config.showIdColumn) {
      this._config.columns = {
        ...{_id:this._config.idColumn },
        ...this._config.columns
      }
    }
    if (this._config.showExpandColumn) {
      this._config.columns = {
        ...{_expandColumn: this._config.expandColumn},
        ...this._config.columns
      }
    }
    Object.keys(this._mappings.properties).forEach(key => {
      const item = this._mappings.properties[key];
      let newColumn: ColumnConfig;
      if (this._config.columns[key]) {
        newColumn = this._config.columns[key];
        newColumn.addKeyword = false;
      } else {
        newColumn = {
          prop: key,
          type: 'basic',
          sortable: true,
          addKeyword: false
        };
      }
      if (item.fields?.keyword) {
        newColumn.addKeyword = true;
      }
      if (item.meta) {
        newColumn.type = item.meta.array ? 'array' : 'basic';
      }
      if (item.properties) {
        newColumn.type = 'object';
      }

      switch(newColumn.type) {
        case 'basic':
          break;
        case 'array':
          newColumn.cellTemplate = this.arrayTmpl;
          break;
        case 'object':
          newColumn.cellTemplate = this.objTmpl;
          break;
      }
      this._config.columns[key] = newColumn;
    });
  }

  async setPage(pageInfo: any, text?: string) {
    this._config.offset = pageInfo.offset;
    await this.refreshData();
  }

  onSort(event) {
    this._config.sortItem = {field: event.column.prop, type: event.newValue};
    if(event.column.addKeyword) {
      this._config.sortItem.field = `${event.column.prop}.keyword`;
    }
    this.refreshData();
  }

  refreshColumns() {
    const newColumns = [];
    const configColumns = Object.keys(this._config.columns);
    configColumns.forEach(key => {
      const column = this._config.columns[key];
      if(!column.hide) {
        newColumns.push(column);
      } else {
        //column.width = null;
      }
    });
    this.columns = [...newColumns];
  }


  async refreshData(resetOffset?: boolean) {
    if(resetOffset) {
      this._config.offset = 0;
    }
    let sortItems: SortItem[] = [];
    if(this._config.sortItem) {
      sortItems = [this._config.sortItem];
    }
    let tempRows = [];
    if(this.searchText) {
      const result = await this._service.searchData(
          this._config.index,
          this.searchText,
          sortItems,
          (this._config.offset * this._config.limit),
          this._config.limit);

      this._config.totalCount = result.count;
      this.searchScore = result.score;
      tempRows = result.items;
    } else {
      tempRows = await this._service.getAll(
        this._config.index,
        sortItems,
        (this._config.offset * this._config.limit),
        this._config.limit);
    }
    this.rows = [...tempRows];
  }

  toggleColumn(col: string): boolean {
    this._config.columns[col].hide = !this._config.columns[col].hide;
    
    this.refreshColumns();
    return this._config.columns[col].hide;
  }

  toggleExpandRow(row) {
    this.table.rowDetail.toggleExpandRow(row);
  }

  openConfig() {
    const dialogRef = this.dialog.open(TableConfigDialogComponent, {
      hasBackdrop: true,
      data: this._config
    });

  }

}
