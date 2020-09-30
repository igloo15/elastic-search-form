import { Component, OnInit, Input, TemplateRef, ViewChild, Inject, ElementRef, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { ElasticConnectionService, ESMapping, SortItem } from '@igloo15/elasticsearch-angular-service';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { IColumn } from '../../model/table-types';
import { TableConfig, ColumnConfig, TableConfigCollection, ColumnCollection } from '../../model/table-config';
import { MatDialog } from '@angular/material/dialog';
import { TableConfigDialogComponent } from '../table-config-dialog/table-config-dialog.component';
import { EsTableConfigService } from '../../elasticsearch-table.config';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'es-table',
  templateUrl: './es-table.component.html',
  styleUrls: ['./es-table.component.scss']
})
export class EsTableComponent implements OnInit, OnDestroy {

  @ViewChild('arrayTmpl', { static: true }) arrayTmpl: TemplateRef<any>;
  @ViewChild('objTmpl', { static: true }) objTmpl: TemplateRef<any>;
  @ViewChild('expandTmpl', { static: true }) expandTmpl: TemplateRef<any>;
  @ViewChild('linkTmpl', { static: true }) linkTmpl: TemplateRef<any>;
  @ViewChild('basicTmpl', { static: true }) basicTmpl: TemplateRef<any>;
  @ViewChild('topButton', { static: false }) topButton: ElementRef<HTMLButtonElement>;
  @ViewChild('bottomButton', { static: false }) bottomButton: ElementRef<HTMLButtonElement>;

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


  public get allColumns() {
    return Object.keys(this.currentColumnConfig).map((value) => {
      return this.currentColumnConfig[value];
    });
  }

  

  public ColumnMode = ColumnMode;
  public items: any[];
  public rows: any[];
  public columns: IColumn[] = [];
  public currentColumnConfig: ColumnCollection = {};
  public searchText: string;
  public searchTextUpdate = new Subject<any>();
  public searchScore: number;
  public loading = true;
  public limits = [1, 5, 10, 25, 50];

  private _service: ElasticConnectionService;
  private _mappings: ESMapping;
  private _config: TableConfig;
  private _mySub: Subscription;
  private _myConnSub: Subscription;
  private _myParamSub: Subscription;
  constructor(service: ElasticConnectionService, public dialog: MatDialog,
    private route: ActivatedRoute, @Inject(EsTableConfigService) private configService: TableConfigCollection) {

    this._service = service;
    this.items = [];
    this._mySub = this.searchTextUpdate.pipe(
      debounceTime(500),
      distinctUntilChanged()
    )
    .subscribe(result => {
      this.searchText = result.target.value;
      this.refreshData(true);
    });
  }

  async ngOnInit(): Promise<void> {
    if (!this.config) {
      this.config = this.configService.default;
    }
    if(this.config.index) {
      this._myConnSub = this._service.isStarted.subscribe(async (result) => {
        if(result && this.config) {
          await this.startUp();
        }
      });
    }
    this._myParamSub = this.route.paramMap.subscribe(params => {
      const indexName = params.get('index');
      if(this.config && this.config.index !== indexName) {
        const newIndexConfig = this.configService.indexConfigs[indexName];
        if (newIndexConfig) {
          this.config = newIndexConfig;
        } else {
          this.config = this.configService.default;
        }
      }
      if (params.get('offset') && this.config) {
        this.config.offset = +params.get('offset');
      }
      if (this.config) {
        this.config.index = indexName;
        this.startUp();
      }
    });

  }

  isArray(value: any) {
    return Array.isArray(value);
  }

  scrollUpOrDown($element: any) {
    $element._elementRef.nativeElement.scrollIntoView({
      inline: 'nearest',
      block: 'start',
      behavior: 'smooth'
    });
  }

  async startUp() {
    this._mappings = await this._service.getMapping(this.config.index);
    this.config.totalCount = await this._service.getCount(this.config.index);
    this.updateMappings();
    this.refreshColumns();
    this.refreshData();
    this.loading = false;
  }

  updateConfigFunction() {
    this.config.expandColumn.cellTemplate = this.expandTmpl;
    this.config.viewColumn.cellTemplate = this.linkTmpl;
    this.config.editColumn.cellTemplate = this.linkTmpl;
    this.config.refreshColumns = () => { this.refreshColumns(); };
    this.config.refreshData = (resetOffset?:boolean) => { this.refreshData(resetOffset); };
    this.config.toggleIdColumn = () => {
      this.config.showIdColumn = this.toggleColumn(this.config.idColumn.prop);
    }
    this.config.toggleColumn = (id: string) => {
      this.toggleColumn(id);
    }
    this.config.updateMappings = () => this.updateMappings();
  }

  updateMappings() {
    this.currentColumnConfig = {};
    if(this.config.showIdColumn) {
      this.currentColumnConfig = {
        ...{_id:this.config.idColumn },
        ...this.currentColumnConfig
      }
    }
    if (this.config.showExpandColumn) {
      this.currentColumnConfig = {
        ...{_expandColumn: this._config.expandColumn},
        ...this.currentColumnConfig
      }
    }
    const columnKeys = Object.keys(this.config.columns);
    const myColumns = columnKeys.map(key => {
      const newColumn = this.config.columns[key];
      newColumn.addKeyword = false;
      return newColumn;
    });
    const extraColumns = Object.keys(this._mappings.properties).filter(key => columnKeys.indexOf(key) === -1).map(key => {
      const newColumn: ColumnConfig = {
        prop: key,
        name: this.transformTitle(key),
        key,
        type: 'basic',
        sortable: true,
        addKeyword: false
      }
      return newColumn;
    });
    if(this.config.showExtra) {
      myColumns.push(...extraColumns);
    }
    myColumns.forEach(columnConfig => {
      const item = this._mappings.properties[columnConfig.prop];
      if(item) {
        if (item.fields?.keyword) {
          columnConfig.addKeyword = true;
        }
        if (item.meta) {
          columnConfig.type = item.meta.array ? 'array' : 'basic';
        }
        if (item.properties) {
          columnConfig.type = 'object';
        }
        switch(columnConfig.type) {
          case 'array':
            columnConfig.cellTemplate = this.arrayTmpl;
            break;
          case 'object':
            columnConfig.cellTemplate = this.objTmpl;
            break;
          default:
            if (item.type && this.config.dataConverters[item.type]) {
              columnConfig.cellTemplate = this.config.dataConverters[item.type].template;
            } else {
              columnConfig.cellTemplate = this.basicTmpl;
            }
            break;
        }
        this.currentColumnConfig[columnConfig.prop] = columnConfig;
      }
    });
    // Object.keys(this._mappings.properties).forEach(key => {
    //   const item = this._mappings.properties[key];
    //   let newColumn: ColumnConfig;
    //   if (this.config.columns[key]) {
    //     newColumn = this.config.columns[key];
    //     newColumn.addKeyword = false;
    //   } else {
    //     newColumn = {
    //       prop: key,
    //       name: this.transformTitle(key),
    //       key,
    //       type: 'basic',
    //       sortable: true,
    //       addKeyword: false
    //     };
    //   }
    // });
    if (this.config.showViewColumn) {
      this.currentColumnConfig = {
        ...this.currentColumnConfig,
        ...{_viewColumn: this.config.viewColumn}
      }
    }
    if (this.config.showEditColumn) {
      this.currentColumnConfig = {
        ...this.currentColumnConfig,
        ...{_editColumn: this.config.editColumn}
      }
    }
  }

  async setPage(pageInfo: any, text?: string) {
    this.config.offset = pageInfo.offset;
    await this.refreshData();
  }

  public getTitle(val: ColumnConfig) {
    return val.displayName ?? val.name ?? val.prop;
  }

  public  transformTitle(value: string)
  {
    return value.replace(/([A-Z])/g, match => ` ${match}`).replace(/^./, match => match.toUpperCase());
  }

  onSort(event) {
    this.config.sortItem = {field: event.column.prop, type: event.newValue};
    if(event.column.addKeyword) {
      this.config.sortItem.field = `${event.column.prop}.keyword`;
    }
    this.refreshData();
  }

  refreshColumns() {
    const newColumns: IColumn[] = [];
    const configColumns = Object.keys(this.currentColumnConfig);
    configColumns.forEach(key => {
      const column = this.currentColumnConfig[key];
      if(!column.hide) {
        // if(column.width) {
        //   column.width = null;
        // }
        // if (column.$$oldWidth) {
        //   column.$$oldWidth = null;
        // }
        newColumns.push(column);
      } else {
        //column.width = null;
      }
    });
    this.columns = [...newColumns];
    this.table.recalculate();
  }


  async refreshData(resetOffset?: boolean) {
    if(resetOffset) {
      this.config.offset = 0;
    }
    let sortItems: SortItem[] = [];
    if(this.config.sortItem) {
      sortItems = [this.config.sortItem];
    }
    let tempRows = [];
    if(this.searchText) {
      const result = await this._service.searchData(
          this.config.index,
          this.searchText,
          sortItems,
          (this.config.offset * this.config.limit),
          this.config.limit);

      this.config.totalCount = result.count;
      this.searchScore = result.score;
      tempRows = result.items;
    } else {
      tempRows = await this._service.getAll(
        this.config.index,
        sortItems,
        (this.config.offset * this.config.limit),
        this.config.limit);
    }
    this.rows = [...tempRows];
  }

  toggleColumn(col: string): boolean {
    this.currentColumnConfig[col].hide = !this.currentColumnConfig[col].hide;

    this.refreshColumns();
    return this.currentColumnConfig[col].hide;
  }

  toggleExpandRow(row) {
    this.table.rowDetail.toggleExpandRow(row);
  }

  openConfig() {
    const dialogRef = this.dialog.open(TableConfigDialogComponent, {
      hasBackdrop: true,
      disableClose: true,
      data: { config: this._config, columnConfig: this.currentColumnConfig }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.refreshColumns();
    });
  }

  documentRoute(row: any, value: any, column: any) {
    const route = column.name === 'View' ? 'view' : 'edit';
    return ['/document', this.config.index, route, row._id];
  }

  ngOnDestroy() {
    this._mySub?.unsubscribe();
    this._myConnSub?.unsubscribe();
    this._myParamSub?.unsubscribe();
  }

}
