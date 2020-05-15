import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { Component, OnInit } from '@angular/core';
import { ESField, ESFieldData } from '../../models/document-config';
import { DocumentUtility } from '../../document-utility';
import { MatChipInputEvent } from '@angular/material/chips';

@Component({
  selector: 'es-field-chips',
  templateUrl: './es-field-chips.component.html',
  styleUrls: ['./es-field-chips.component.scss']
})
export class EsFieldChipsComponent implements ESField, OnInit {

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  data: ESFieldData;

  constructor() { }

  ngOnInit(): void {
  }

  getValue() {
    return DocumentUtility.getValue(this.data.key, this.data.model);
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
    const index = this.getValue().indexOf(item);

    if (index >= 0) {
      this.getValue().splice(index, 1);
    }
  }
}
