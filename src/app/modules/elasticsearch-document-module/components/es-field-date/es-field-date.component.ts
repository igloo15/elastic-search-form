import { Component, OnInit } from '@angular/core';
import { ESField, ESFieldData } from '../../models/field-data';
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

}
