import { Component, OnInit, Inject, TemplateRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TableConfig, ColumnConfig } from '../../model/table-config';
import { ComponentType } from '@angular/cdk/portal';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
  selector: 'es-table-config-dialog',
  templateUrl: './table-config-dialog.component.html',
  styleUrls: ['./table-config-dialog.component.scss']
})
export class TableConfigDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<TableConfigDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: TableConfig) { }

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
    this.data.showSearch = ob.checked;
  }

  onRefreshChange(ob: MatSlideToggleChange) {
    this.data.showRefresh = ob.checked;
  }

  onDropDownChange(ob: MatSlideToggleChange) {
    this.data.showLimitDropDown = ob.checked;
  }

  onColumnHideChange(col: string) {
    this.data.toggleColumn(col);
  }
}
