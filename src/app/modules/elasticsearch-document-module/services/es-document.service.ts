import { Injectable } from '@angular/core';
import { ModelRoot, ModelProp, ModelTypes } from '../models/model-data';
import { ESMapping, ESSubProperty } from '@igloo15/elasticsearch-angular-service';
import { ESFieldConfig, ESCustomFieldConfig } from '../models/field-data';
import { DocumentUtility } from '../document-utility';
import { TemplateFactoryService } from './template-factory.service';

@Injectable({
  providedIn: 'root'
})
export class EsDocumentService {

  constructor(private templateFactory: TemplateFactoryService) { }

  getConfig(prop: ModelProp, editable: boolean): ESFieldConfig {
    const customConfig: ESCustomFieldConfig = {};
    const label = DocumentUtility.capitalize(prop.key);
    let type = '';
    switch(prop.type) {
      case 'integer':
      case 'double':
        type = 'number';
        break;
      case 'date':
        type = 'datepicker';
        break;
      case 'string':
        type = 'input';
        break;
      case 'array':
        type = prop.type;
        break;
      default:
        type = prop.type;
        break;
    }
    if (type) {
      const template = this.templateFactory.getTemplate(type).template;
      const configItem: ESFieldConfig = {
        data: {
          disabled: !editable,
          customConfig,
          label,
          type,
          model: prop
        },
        template
      };

      return configItem;
    }
    return null;
  }

  getProp(keys: string[], index: number, model: ModelRoot | ModelProp) {
    if (model.properties) {
      for(const prop of model.properties) {
        if (prop.key === keys[index]) {
          index++;
          if (keys.length >= index) {
            return prop;
          } else {
            return this.getProp(keys, index, prop);
          }
        }
      }
    }

    return null;
  }

  parseModel(model: any, mapping: ESMapping) {
    const rootModel: ModelRoot = { properties: [], value: model };
    const props = mapping?.properties ?? model;
    Object.keys(props).forEach((key, index) => {
      const mapValue = props[key];
      const value = model[key];
      const prop = this.createProp(key, value, mapValue);
      rootModel.properties.push(prop);
    });
    return rootModel;
  }

  createProp(key: string, prop: any, subMap: ESSubProperty): ModelProp {
    const modelType = this.getType(prop, subMap);
    const props = subMap?.properties ?? prop;
    const propModel: ModelProp = {
      type: modelType,
      key,
      value: prop
    }
    if (modelType === 'object') {
      propModel.properties = [];
      Object.keys(props).forEach((subKey, index) => {
        const subMapValue = props[subKey];
        const value = prop[subKey];
        const subProp = this.createProp(subKey, value, subMapValue);
        propModel.properties.push(subProp);
      });
    }
    return propModel;
  }

  getType(prop: any, subMap?: ESSubProperty): ModelTypes {
    let result: ModelTypes = 'object';
    if (!prop) {
      if (subMap.properties) {
        result = 'object';
      } else if (subMap.meta?.array) {
        result = 'array';
      } else {
        switch(subMap.type) {
          case 'text':
          case 'keyword':
            result = 'string';
            break;
          case 'long':
          case 'integer':
          case 'short':
          case 'byte':
            result = 'integer';
            break;
          case 'double':
          case 'float':
          case 'half_float':
          case 'scaled_float':
            result = 'double';
            break;
          case 'date':
          case 'date_nanos':
            result = 'date';
            break;
          case 'boolean':
            result = 'bool';
            break;
          default:
            result = null;
            break;
        }
      }
      return result;
    }

    if (typeof prop === 'string') {
      if (subMap.type === 'date') {
        result = 'date';
      } else {
        result = 'string';
      }
    } else if (typeof prop === 'number') {
      switch(subMap.type) {
        case 'long':
        case 'integer':
        case 'short':
        case 'byte':
          result = 'integer';
          break;
        case 'double':
        case 'float':
        case 'half_float':
        case 'scaled_float':
          result = 'double';
          break;
        case 'date_nanos':
          result = 'date';
          break;
      }
      if (subMap.type) {
        result = 'integer';
      } else {
        result = 'double';
      }
    } else if (typeof prop === 'boolean') {
      result = 'bool';
    } else if (Array.isArray(prop)) {
      result = 'array';
    } else if (typeof prop === 'object') {
      result = 'object';
    }
    return result;
  }

  recreateData(model: ModelRoot): any {
    const rootData = {};
    model.properties.forEach((prop) => {
      const propValue = this.recreateSubData(prop);
      rootData[prop.key] = propValue;
    });
    return rootData;
  }

  recreateSubData(prop: ModelProp): any {
    let propData = {};
    if (prop.properties) {
      prop.properties.forEach((subProp) => {
        const propValue = this.recreateSubData(subProp);
        propData[subProp.key] = propValue;
      });
    } else {
      propData = prop.value;
    }
    return propData;
  }
}
