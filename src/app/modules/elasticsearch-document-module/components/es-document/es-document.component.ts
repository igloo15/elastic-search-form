import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ElasticConnectionService, ESMapping, ESSubProperty } from '@igloo15/elasticsearch-angular-service';
import { ActivatedRoute } from '@angular/router';
import { ESDocumentConfig, ESDocumentBuilder, ESDocumentRowConfig } from '../../models/document-config';
import { ESCustomFieldConfig, ESFieldConfig, ESFieldData } from '../../models/field-data';
import { TemplateFactoryService } from '../../services/template-factory.service';
import { DocumentUtility } from '../../document-utility';
import { EsDocumentService } from '../../services/es-document.service';
import { ModelRoot, ModelProp } from '../../models/model-data';

interface Row {
  config: ESDocumentRowConfig;
  items: ESFieldConfig[];
}

@Component({
  selector: 'es-document',
  templateUrl: './es-document.component.html',
  styleUrls: ['./es-document.component.scss']
})
export class EsDocumentComponent implements OnInit {

  private editFields = false;
  public model: ModelRoot;

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

  public title = '';
  public rows: Row[] = [];

  constructor(public esService: ElasticConnectionService, private route: ActivatedRoute, private documentService: EsDocumentService) {
    this.config = new ESDocumentBuilder('', '', 'My Form').build();
  }

  ngOnInit(): void {
    this.route.url.subscribe(segments => {
      if (segments.length > 3) {
        this.config.disable = segments[2].path === 'view';
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
      if(result) {
        await this.queryES();
      }
    });
  }

  async queryES() {
    if(this.index && this.id) {
      const mapping = await this.esService.getMapping(this.index);
      const result = await this.esService.getById<any>(this.index, this.id);
      if (result && mapping) {
        this.model = this.documentService.parseModel(result, mapping);
        console.log(this.model);
        this.title = DocumentUtility.getTitle(this._config.title, this.model.value);
        this.updateFormConfig(mapping);
      }
    }
  }

  updateFormConfig(mapping: ESMapping) {
    if (this._config.fields.length > 0) {
      this.rows = [...this.parseWithConfig()];
    } else {
      this.rows = [...this.parseWithoutConfig()];
    }
  }

  onSubmit() {
    console.log('saving');
  }

  private parseWithConfig() {
    const newRows: Row[] = [];
    for(const row of this._config.fields) {
      const newRow: Row = {
        config: row,
        items: []
      };
      row.columns.forEach(value => {
        if(this.config.disable) {
          value.disable = this.config.disable;
        }
        const prop = this.documentService.getProp(value.key.split('.'), 0, this.model);
        const result = this.documentService.getConfig(prop, value);
        newRow.items.push(result);
      });
      newRows.push(newRow);
    }
    return newRows;
  }

  private parseWithoutConfig() {
    const newRows: Row[] = [];
    for(const prop of this.model.properties) {
      const formConfig = this.documentService.getConfig(prop,
        {
          key:'',
          type: '',
          title: DocumentUtility.capitalize(prop.key),
          disable: this.config.disable,
          stretch: true
        });
      newRows.push({
        config: {
          columns:[],
          stretch: true
        },
        items: [
          formConfig
        ]
      });
    }
    return newRows;
  }

  getStyle(row: ESDocumentRowConfig) {
    if(row.stretch) {
      return 'width:100%';
    }
  }
}
