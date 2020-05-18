import { Component, OnInit } from '@angular/core';
import { EsComponentBase } from '../../models/es-component-base';

@Component({
  selector: 'es-field-number-input',
  templateUrl: './es-field-number-input.component.html',
  styleUrls: ['./es-field-number-input.component.scss']
})
export class EsFieldNumberInputComponent extends EsComponentBase implements OnInit {
  showError = false;
  showDecimalError = false;
  constructor() { super(); }

  ngOnInit(): void {
  }

  onNumberChange(event: any) {
    if ((this.data.config.min !== undefined) && (this.data.config.max !== undefined)) {
      if (event.target.value < this.data.config.min || event.target.value > this.data.config.max) {
        event.target.value = this.getValue();
        this.showError = true;
        return;
      }
    }
    if (this.data.model.type === 'integer') {
      if(event.target.value % 1 !== 0) {
        this.showDecimalError = true;
        event.target.value = this.getValue();
        return;
      }
    }
    this.showError = false;
    this.showDecimalError = false;
    this.onChange(event);
  }

}
