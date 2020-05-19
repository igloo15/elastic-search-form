import { Injectable, Inject } from '@angular/core';
import { ModelRoot, ModelProp, ModelTypes } from '../models/model-data';
import { ESMapping, ESSubProperty } from '@igloo15/elasticsearch-angular-service';
import { ESFieldConfig, ESCustomFieldConfig } from '../models/field-data';
import { DocumentUtility } from '../document-utility';
import { TemplateFactoryService } from './template-factory.service';
import { ESFieldItemConfig, ESDocumentRowConfig, ESDocumentConfig, ESDocumentConfigCollection } from '../models/document-config';
import { EsDocumentConfigService } from '../elasticsearch-document-token.config';


export interface Row {
  config: ESDocumentRowConfig;
  items: ESFieldConfig[];
}

@Injectable({
  providedIn: 'root'
})
export class EsDocumentService {

  constructor(private templateFactory: TemplateFactoryService,
    @Inject(EsDocumentConfigService)private configService: ESDocumentConfigCollection) { }

  getDefaultConfig() {
    return this.configService.default;
  }

  getIndexConfig(index: string) {
    return this.configService.indexConfigs.get(index) ?? this.configService.default;
  }

  getConfig(prop: ModelProp, itemConfig: ESFieldItemConfig): ESFieldConfig {
    const type = this.convertToTemplateType(prop, itemConfig);
    if (type) {
      itemConfig.type = type;
      const templateDef = this.templateFactory.getTemplate(type);
      if (!templateDef) {
        return null;
      }
      if (prop.type === 'array' && prop.childType === 'object') {
        return null;
      }
      const configItem: ESFieldConfig = {
        data: {
          config: itemConfig,
          model: prop
        },
        template: templateDef.template
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
          if (index >= keys.length) {
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
    if (modelType === 'array') {
      propModel.childType = this.getType(prop[0], subMap);
    } else if (modelType === 'object') {
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

  convertToTemplateType(prop: ModelProp, itemConfig: ESFieldItemConfig) {
    if (itemConfig.type) {
      return itemConfig.type;
    }
    switch(prop.type) {
      case 'integer':
      case 'double':
        return 'number';
      case 'date':
      case 'date_nanos':
        return 'datepicker';
      case 'string':
        return 'input';
      case 'bool':
        return 'toggle';
      case 'array':
        return prop.type;
      default:
        return prop.type;
    }
  }

  getType(prop: any, subMap?: ESSubProperty): ModelTypes {
    let result: ModelTypes = 'object';
    if ((prop === null || prop === undefined)) {
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
      if (subMap.type === 'date' || subMap.type === 'date_nanos') {
        result = subMap.type;
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
          result = 'date_nanos';
          break;
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

  parseWithConfig(model: ModelRoot, config: ESDocumentConfig): Row[] {
    const newRows: Row[] = [];
    for(const row of config.fields) {
      const fieldConfigs: ESFieldConfig[] = [];
      row.columns.forEach(value => {
        if(config.disable) {
          value.disable = config.disable;
        }
        const prop = this.getProp(value.key.split('.'), 0, model);
        const result = this.getConfig(prop, value);
        if (result) {
          fieldConfigs.push(result);
        }
      });
      newRows.push(this.createRow(fieldConfigs, row));
    }
    return newRows;
  }

  parseWithoutConfig(model: ModelRoot, config: ESDocumentConfig): Row[] {
    const newRows: Row[] = [];
    for(const prop of model.properties) {
      const formConfig = this.getConfig(prop, this.createEmptyEsFieldItemConfig(prop, config));
      if (formConfig) {
        newRows.push(this.createRow([formConfig]));
      }
    }
    return newRows;
  }

  createRow(formConfig: ESFieldConfig[], row?: ESDocumentRowConfig): Row {
    if (!row) {
      row = {
        columns:[],
        style: {
          stretch: true
        }
      };
    }
    return {
      config: row,
      items: [
        ...formConfig
      ]
    }
  }

  createEmptyEsFieldItemConfig(prop: ModelProp, config: ESDocumentConfig) {
    return {
      key:'',
      type: '',
      title: DocumentUtility.capitalize(prop.key),
      disable: config.disable,
      style: {
        stretch: true
      }
    };
  }
}
