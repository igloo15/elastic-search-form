import { Component, OnInit } from '@angular/core';
import { EsComponentBase } from '../../models/es-component-base';

@Component({
  selector: 'es-field-table',
  templateUrl: './es-field-table.component.html',
  styleUrls: ['./es-field-table.component.scss']
})
export class EsFieldTableComponent extends EsComponentBase implements OnInit {

  constructor() {
    super();
  }

  ngOnInit(): void {
  }

  getKeyValue(key: string) {
    return this.getValue()[key];
  }

  onTextChange(event: any, key: string) {
    const value = this.getValue();
    value[key] = event.target.value;
    this.setValue(value);
  }
}
