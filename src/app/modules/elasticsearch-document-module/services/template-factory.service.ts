import { Injectable } from '@angular/core';
import { ESFieldDefinition } from '../models/field-data';
import { EsFieldInputComponent } from '../components/es-field-input/es-field-input.component';
import { EsFieldToggleComponent } from '../components/es-field-toggle/es-field-toggle.component';
import { EsFieldChipsComponent } from '../components/es-field-chips/es-field-chips.component';
import { EsFieldNumberInputComponent } from '../components/es-field-number-input/es-field-number-input.component';
import { EsFieldDateComponent } from '../components/es-field-date/es-field-date.component';

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
  }

  addTemplate(definition: ESFieldDefinition) {
    this.definitions.set(definition.type, definition);
  }

  getTemplate(type: string): ESFieldDefinition {
    return this.definitions.get(type);
  }

}
