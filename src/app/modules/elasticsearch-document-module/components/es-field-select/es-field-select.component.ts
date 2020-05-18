import { Component, OnInit } from '@angular/core';
import { EsComponentBase } from '../../models/es-component-base';

@Component({
  selector: 'es-field-select',
  templateUrl: './es-field-select.component.html',
  styleUrls: ['./es-field-select.component.scss']
})
export class EsFieldSelectComponent extends EsComponentBase implements OnInit {

  constructor() { super(); }

  ngOnInit(): void {
  }

  onDataSet() {
    console.log(this.data.config.title);
  }

  isNumber() {
    if (this.data?.config?.numOptions) {
      return true;
    }
    return false;
  }

}
