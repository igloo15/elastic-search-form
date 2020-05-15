import { Component, OnInit } from '@angular/core';
import { ESField, ESFieldData } from '../../models/field-data';
import { DocumentUtility } from '../../document-utility';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
  selector: 'es-field-toggle',
  templateUrl: './es-field-toggle.component.html',
  styleUrls: ['./es-field-toggle.component.scss']
})
export class EsFieldToggleComponent implements ESField, OnInit {

  data: ESFieldData;

  constructor() { }

  ngOnInit(): void {
  }

  onChange(event: MatSlideToggleChange) {
    DocumentUtility.setValue(this.data.key, this.data.model, event.checked);
  }

  getValue() {
    return DocumentUtility.getValue(this.data.key, this.data.model);
  }

}
