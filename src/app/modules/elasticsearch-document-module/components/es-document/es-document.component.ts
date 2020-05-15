import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ElasticConnectionService, ESMapping, ESSubProperty } from '@igloo15/elasticsearch-angular-service';
import { ActivatedRoute } from '@angular/router';
import { ESDocumentConfig, ESFieldConfig, ESCustomFieldConfig } from '../../models/document-config';
import { TemplateFactoryService } from '../../services/template-factory.service';
import { DocumentUtility } from '../../document-utility';

@Component({
  selector: 'es-document',
  templateUrl: './es-document.component.html',
  styleUrls: ['./es-document.component.scss']
})
export class EsDocumentComponent implements OnInit {

  private editFields = false;
  public model: any;

  @Input()
  public set index(val: string) {
    this.config.index = val;
  }

  public get index(): string {
    return this.config.index;
  }

  @Input()
  public set id(val: string) {
    this.config.id = val;
  }

  public get id(): string {
    return this.config.id;
  }

  private _config: ESDocumentConfig;
  @Input()
  public set config(val: ESDocumentConfig) {
    this._config = val;
  }

  public get config(): ESDocumentConfig {
    return this._config;
  }

  public form = new FormGroup({});
  public fields: ESFieldConfig[] = [];

  constructor(public esService: ElasticConnectionService, private route: ActivatedRoute, private templateFactory: TemplateFactoryService) {
    this.config = new ESDocumentConfig();
  }

  ngOnInit(): void {
    this.route.url.subscribe(segments => {
      console.log(segments);
      if (segments.length > 3) {
        this.editFields = segments[2].path === 'edit';
      }
    });
    this.route.paramMap.subscribe(params => {
      if(params.get('index')) {
        this.index = params.get('index');
      }
      if (params.get('id')) {
        this.id = params.get('id');
      }
      this.queryES();
    });
    this.esService.isStarted.subscribe(async result => {
      if(result && this.index && this.id) {
        await this.queryES();
      }
    });
  }

  async queryES() {
    const mapping = await this.esService.getMapping(this.index);
    const result = await this.esService.getById<any>(this.index, this.id);
    if (result && mapping) {
      this.model = result;
      this.updateFormConfig(mapping);
    }
  }

  updateFormConfig(mapping: ESMapping) {
    const newFields: ESFieldConfig[] = [];
    Object.keys(mapping.properties).forEach(key => {
      const item = mapping.properties[key];
      if (item.type) {
        const formConfig = this.getConfig(key, item);
        newFields.push(formConfig);
      }
    });
    this.fields = [...newFields];
  }

  onSubmit() {
    console.log('saving');
  }

  getConfig(key: string, item: ESSubProperty): ESFieldConfig {
    const customConfig: ESCustomFieldConfig = {};
    const keys = key.split('.');
    const value = DocumentUtility.getValue(keys, this.model);
    const label = DocumentUtility.capitalize(key);
    let type = '';
    if (Array.isArray(value)) {
      type = 'array';
    } else {
      switch(item.type) {
        case 'text':
        case 'keyword':
          type = 'input';
          break;
        case 'long':
        case 'integer':
        case 'short':
        case 'byte':
          type = 'number';
          break;
        case 'double':
        case 'float':
        case 'half_float':
        case 'scaled_float':
          type = 'number';
          break;
        case 'date':
          type = 'datepicker';
          break;
        case 'date_nanos':
          break;
        case 'boolean':
          type = 'toggle';
          break;
        default:
          break;
      }
    }

    if (type) {
      const template = this.templateFactory.getTemplate(type).template;
      const configItem: ESFieldConfig = {
        data: {
          key: keys,
          disabled: !this.editFields,
          customConfig,
          label,
          type,
          model: this.model
        },
        template
      };

      return configItem;
    }
    return null;
  }

}
