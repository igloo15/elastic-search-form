import { Injectable } from '@angular/core';
import { ESFieldDefinition } from '../models/field-data';
import { EsFieldInputComponent } from '../components/es-field-input/es-field-input.component';
import { EsFieldToggleComponent } from '../components/es-field-toggle/es-field-toggle.component';
import { EsFieldChipsComponent } from '../components/es-field-chips/es-field-chips.component';
import { EsFieldNumberInputComponent } from '../components/es-field-number-input/es-field-number-input.component';
import { EsFieldDateComponent } from '../components/es-field-date/es-field-date.component';
import { EsFieldSelectComponent } from '../components/es-field-select/es-field-select.component';
import { EsFieldSliderComponent } from '../components/es-field-slider/es-field-slider.component';
import { EsFieldTableComponent } from '../components/es-field-table/es-field-table.component';

@Injectable({
  providedIn: 'root'
})
export class TemplateFactoryService {

   definitions: Map<string, ESFieldDefinition> = new Map<string, ESFieldDefinition>();

  constructor() {
    this.addTemplate({
      type: 'input',
      template: EsFieldInputComponent
    });
    this.addTemplate({
      type: 'toggle',
      template: EsFieldToggleComponent
    });
    this.addTemplate({
      type: 'array',
      template: EsFieldChipsComponent
    });
    this.addTemplate({
      type: 'number',
      template: EsFieldNumberInputComponent
    });
    this.addTemplate({
      type: 'datepicker',
      template: EsFieldDateComponent
    });
    this.addTemplate({
      type: 'select',
      template: EsFieldSelectComponent
    });
    this.addTemplate({
      type: 'slider',
      template: EsFieldSliderComponent
    });
    this.addTemplate({
      type: 'table',
      template: EsFieldTableComponent
    });
  }

  addTemplate(definition: ESFieldDefinition) {
    this.definitions.set(definition.type, definition);
  }

  getTemplate(type: string): ESFieldDefinition {
    const template = this.definitions.get(type);
    if (template) {
      return template;
    } else {
      return null;
    }
  }

}
