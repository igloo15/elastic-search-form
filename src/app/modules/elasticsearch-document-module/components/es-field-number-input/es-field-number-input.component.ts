import { Component, OnInit } from '@angular/core';
import { ESFieldData, ESField } from '../../models/field-data';
import { DocumentUtility } from '../../document-utility';

@Component({
  selector: 'es-field-number-input',
  templateUrl: './es-field-number-input.component.html',
  styleUrls: ['./es-field-number-input.component.scss']
})
export class EsFieldNumberInputComponent implements ESField, OnInit {

  data: ESFieldData;

  constructor() { }

  ngOnInit(): void {
  }

  getValue() {
    return DocumentUtility.getValue(this.data.key, this.data.model);
  }

  setValue(value: any) {
    DocumentUtility.setValue(this.data.key, this.data.model, value);
  }
}
