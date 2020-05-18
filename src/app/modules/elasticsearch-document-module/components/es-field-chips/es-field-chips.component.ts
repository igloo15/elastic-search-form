import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { Component, OnInit } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { EsComponentBase } from '../../models/es-component-base';

@Component({
  selector: 'es-field-chips',
  templateUrl: './es-field-chips.component.html',
  styleUrls: ['./es-field-chips.component.scss']
})
export class EsFieldChipsComponent extends EsComponentBase implements OnInit {

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  constructor() { super(); }

  ngOnInit(): void {
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.getValue().push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(item: string): void {
    const index = this.data.model.value.indexOf(item);

    if (index >= 0) {
      this.getValue().splice(index, 1);
    }
  }

}
