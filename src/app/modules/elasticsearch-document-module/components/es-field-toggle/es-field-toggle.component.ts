import { Component, OnInit } from '@angular/core';
import { ESField, ESFieldData } from '../../models/field-data';
import { DocumentUtility } from '../../document-utility';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { EsComponentBase } from '../../models/es-component-base';

@Component({
  selector: 'es-field-toggle',
  templateUrl: './es-field-toggle.component.html',
  styleUrls: ['./es-field-toggle.component.scss']
})
export class EsFieldToggleComponent extends EsComponentBase implements OnInit {

  constructor() { super(); }

  ngOnInit(): void {
  }

  onChange(event: MatSlideToggleChange) {
    this.setValue(event.checked);
  }

}
