import { Component, OnInit } from '@angular/core';
import { ESField, ESFieldData } from '../../models/field-data';
import { DocumentUtility } from '../../document-utility';

@Component({
  selector: 'es-field-input',
  templateUrl: './es-field-input.component.html',
  styleUrls: ['./es-field-input.component.scss']
})
export class EsFieldInputComponent implements ESField, OnInit {

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
