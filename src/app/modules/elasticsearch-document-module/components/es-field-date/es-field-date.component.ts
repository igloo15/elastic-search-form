import { Component, OnInit } from '@angular/core';
import { ESFieldData } from '../../models/field-data';
import { EsComponentBase } from '../../models/es-component-base';

@Component({
  selector: 'es-field-date',
  templateUrl: './es-field-date.component.html',
  styleUrls: ['./es-field-date.component.scss']
})
export class EsFieldDateComponent extends EsComponentBase implements OnInit {

  constructor() { super(); }

  ngOnInit(): void {
  }

  onDataSet() {
    if (this.data.config && !this.data.config.valueToDisplay && !this.data.config.valueFromDisplay) {
      this.data.config.valueToDisplay = (data: ESFieldData) => new Date(data.model.value);
      this.data.config.valueFromDisplay = (data: Date) => {
        if (this.data.model.type === 'date_nanos') {
          return data.getTime();
        }
        return data.toISOString();
      }
    }
  }

}
