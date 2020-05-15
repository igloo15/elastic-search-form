import { Component, OnInit } from '@angular/core';
import { DocumentUtility } from '../../document-utility';
import { ESField, ESFieldData } from '../../models/field-data';

@Component({
  selector: 'es-field-date',
  templateUrl: './es-field-date.component.html',
  styleUrls: ['./es-field-date.component.scss']
})
export class EsFieldDateComponent implements ESField, OnInit {
  data: ESFieldData;

  constructor() { }

  ngOnInit(): void {
  }


  getValue() {
    return DocumentUtility.getValue(this.data.key, this.data.model);
  }
}
