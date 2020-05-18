import { Component, OnInit } from '@angular/core';
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
