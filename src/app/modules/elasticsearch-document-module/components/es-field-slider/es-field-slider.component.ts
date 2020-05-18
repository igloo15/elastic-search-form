import { Component, OnInit } from '@angular/core';
import { EsComponentBase } from '../../models/es-component-base';

@Component({
  selector: 'es-field-slider',
  templateUrl: './es-field-slider.component.html',
  styleUrls: ['./es-field-slider.component.scss']
})
export class EsFieldSliderComponent extends EsComponentBase implements OnInit {

  constructor() { super(); }

  ngOnInit(): void {
  }

  onDataSet() {
    console.log('starting to set data');
  }

  getInterval() {
    if (this.data.config.interval) {
      return this.data.config.interval;
    }
    return '';
  }
}
