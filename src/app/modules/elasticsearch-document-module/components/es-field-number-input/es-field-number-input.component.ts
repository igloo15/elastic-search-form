import { Component, OnInit } from '@angular/core';
import { EsComponentBase } from '../../models/es-component-base';

@Component({
  selector: 'es-field-number-input',
  templateUrl: './es-field-number-input.component.html',
  styleUrls: ['./es-field-number-input.component.scss']
})
export class EsFieldNumberInputComponent extends EsComponentBase implements OnInit {

  constructor() { super(); }

  ngOnInit(): void {
  }

}
