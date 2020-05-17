import { Component, OnInit, Input, TemplateRef, ViewChild, Inject, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { ElasticConnectionService, ESMapping, SortItem } from '@igloo15/elasticsearch-angular-service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { IColumn } from '../../model/table-types';
import { TableConfig, ColumnConfig } from '../../model/table-config';
import { MatDialog } from '@angular/material/dialog';
import { TableConfigDialogComponent } from '../table-config-dialog/table-config-dialog.component';
import { EsTableConfigService } from '../../elasticsearch-table.config';

@Component({
  selector: 'es-table',
  templateUrl: './es-table.component.html',
  styleUrls: ['./es-table.component.scss']
})
export class EsTableComponent implements OnInit {

  @ViewChild('arrayTmpl', { static: true }) arrayTmpl: TemplateRef<any>;
  @ViewChild('objTmpl', { static: true }) objTmpl: TemplateRef<any>;
  @ViewChild('expandTmpl', { static: true }) expandTmpl: TemplateRef<any>;
  @ViewChild('linkTmpl', { static: true }) linkTmpl: TemplateRef<any>;
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
  public ColumnMode = ColumnMode;
  public items: any[];
  public rows: any[];
  public columns: IColumn[] = [];
  public searchText: string;
  public searchTextUpdate = new Subject<any>();
  public searchScore: number;
  public loading = true;
  public limits = [1, 5, 10, 25, 50];

  private _service: ElasticConnectionService;
  private _mappings: ESMapping;
  private _config: TableConfig;

  constructor(service: ElasticConnectionService, public dialog: MatDialog,
    private route: ActivatedRoute, @Inject(EsTableConfigService) private configService) {

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
    if (!this.config) {
      this.config = this.configService;
    }
    if(this.config.index) {
      this._service.isStarted.subscribe(async (result) => {
        if(result) {
          await this.startUp();
        }
      });
    }
    this.route.paramMap.subscribe(params => {
      if(params.get('index') && this.config) {
        this.configService.index = params.get('index');
      }
      if (params.get('offset') && this.config) {
        this.configService.offset = +params.get('offset');
      }
      this.startUp();
    });

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
    if(this.config.showIdColumn) {
      this.config.columns = {
        ...{_id:this.config.idColumn },
        ...this.config.columns
      }
    }
    if (this.config.showExpandColumn) {
      this.config.columns = {
        ...{_expandColumn: this._config.expandColumn},
        ...this._config.columns
      }
    }
    Object.keys(this._mappings.properties).forEach(key => {
      const item = this._mappings.properties[key];
      let newColumn: ColumnConfig;
      if (this.config.columns[key]) {
        newColumn = this.config.columns[key];
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
        case 'array':
          newColumn.cellTemplate = this.arrayTmpl;
          break;
        case 'object':
          newColumn.cellTemplate = this.objTmpl;
          break;
        default:
          if (item.type && this.config.dataConverters[item.type]) {
            newColumn.cellTemplate = this.config.dataConverters[item.type].template;
          }
          break;
      }
      this.config.columns[key] = newColumn;
    });
    if (this.config.showViewColumn) {
      this.config.columns = {
        ...this.config.columns,
        ...{_viewColumn: this.config.viewColumn}
      }
    }
    if (this.config.showEditColumn) {
      this.config.columns = {
        ...this.config.columns,
        ...{_editColumn: this.config.editColumn}
      }
    }
  }

  async setPage(pageInfo: any, text?: string) {
    this.config.offset = pageInfo.offset;
    await this.refreshData();
  }

  onSort(event) {
    this.config.sortItem = {field: event.column.prop, type: event.newValue};
    if(event.column.addKeyword) {
      this.config.sortItem.field = `${event.column.prop}.keyword`;
    }
    this.refreshData();
  }

  refreshColumns() {
    const newColumns = [];
    const configColumns = Object.keys(this.config.columns);
    configColumns.forEach(key => {
      const column = this.config.columns[key];
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
    this.config.columns[col].hide = !this.config.columns[col].hide;

    this.refreshColumns();
    return this.config.columns[col].hide;
  }

  toggleExpandRow(row) {
    this.table.rowDetail.toggleExpandRow(row);
  }

  openConfig() {
    const dialogRef = this.dialog.open(TableConfigDialogComponent, {
      hasBackdrop: true,
      disableClose: true,
      data: this._config
    });
    dialogRef.afterClosed().subscribe(result => {
      this.refreshColumns();
    });
  }

  documentRoute(row: any, value: any, column: any) {
    const route = column.name === 'View' ? 'view' : 'edit';
    return ['/document', this.config.index, route, row._id];
  }

}
