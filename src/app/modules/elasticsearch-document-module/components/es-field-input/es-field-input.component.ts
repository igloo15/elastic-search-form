import { Component, OnInit } from '@angular/core';
import { ESField, ESFieldData } from '../../models/field-data';
import { DocumentUtility } from '../../document-utility';
import { EsComponentBase } from '../../models/es-component-base';

@Component({
  selector: 'es-field-input',
  templateUrl: './es-field-input.component.html',
  styleUrls: ['./es-field-input.component.scss']
})
export class EsFieldInputComponent extends EsComponentBase implements OnInit {

  constructor() { super(); }

  ngOnInit(): void {
  }

  onChange(event: any) {
    this.setValue(event.target.value);
  }
}
