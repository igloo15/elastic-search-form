import { Component, OnInit, Inject, TemplateRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TableConfig, ColumnConfig, ColumnCollection } from '../../model/table-config';
import { ComponentType } from '@angular/cdk/portal';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
  selector: 'es-table-config-dialog',
  templateUrl: './table-config-dialog.component.html',
  styleUrls: ['./table-config-dialog.component.scss']
})
export class TableConfigDialogComponent implements OnInit {
  config: TableConfig;
  columnConfig: ColumnCollection;

  constructor(public dialogRef: MatDialogRef<TableConfigDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.config = data.config;
    this.columnConfig = data.columnConfig;
  }

  ngOnInit(): void {
  }

  getName(column: ColumnConfig): string {
    if (column.name) {
      return column.name;
    }
    if (column.prop) {
      return column.prop;
    }
    if (column.displayName) {
      return column.displayName;
    }
    return 'Checkbox Column';
  }

  onClose() {
    this.dialogRef.close();
  }

  onSearchChange(ob: MatSlideToggleChange) {
    this.config.showSearch = ob.checked;
  }

  onRefreshChange(ob: MatSlideToggleChange) {
    this.config.showRefresh = ob.checked;
  }

  onDropDownChange(ob: MatSlideToggleChange) {
    this.config.showLimitDropDown = ob.checked;
  }

  onUpArrowChange(ob: MatSlideToggleChange) {
    this.config.showUpArrow = ob.checked;
  }

  onDownArrowChange(ob: MatSlideToggleChange) {
    this.config.showDownArrow = ob.checked;
  }

  onColumnHideChange(col: string) {
    this.config.toggleColumn(col);
  }
}
