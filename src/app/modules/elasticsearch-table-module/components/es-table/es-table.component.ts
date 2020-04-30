import { Component, OnInit, Input, TemplateRef, ViewChild } from '@angular/core';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { ElasticConnectionService, ESMapping, SortItem } from '@igloo15/elasticsearch-angular-service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { IColumn } from '../../model/table-types';
import { TableConfig, ColumnConfig } from '../../model/table-config';

@Component({
  selector: 'es-table',
  templateUrl: './es-table.component.html',
  styleUrls: ['./es-table.component.scss']
})
export class EsTableComponent implements OnInit {

  @ViewChild('arrayTmpl', { static: true }) arrayTmpl: TemplateRef<any>;

  @Input()
  public set limit(val: number) {
    this.config.limit = val;
    this.refreshData();
  }

  public get limit(): number {
    return this.config.limit;
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

  constructor(service: ElasticConnectionService) {
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
    this._config.toggleIdColumn = () => {
      this._config.startWithIdColumn = this.toggleColumn('_id');
    }
    this._config.toggleColumn = (id: string) => {
      this.toggleColumn(id);
    }
  }

  updateMappings() {
    if(this._config.startWithIdColumn) {
      this._config.columns['_id'] = {prop:'_id', name: 'Id', hide: false, type:'basic', addKeyword:false, sortable:false};
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
      if(!column.hide && column.type !== 'object') {
        newColumns.push(column);
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
    // const isChecked = this.isColumnShown(col.name);

    // if (isChecked) {
    //   this.columns = this.columns.filter(c => {
    //     return c.name !== col.name;
    //   });
    //   return false;
    // } else {
    //   this.columns = [...this.columns, col];
    //   return true;
    // }

    this._config.columns[col].hide = !this._config.columns[col].hide;
    this.refreshColumns();
    return this._config.columns[col].hide;
  }

  isColumnShown(col: string) {
    for(const item of this.columns) {
      if(item.name === col) {
        return true;
      }
    }

    return false;
  }

}
