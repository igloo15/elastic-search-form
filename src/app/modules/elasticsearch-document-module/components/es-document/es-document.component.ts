import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ElasticConnectionService, ESMapping, ESSubProperty } from '@igloo15/elasticsearch-angular-service';
import { ActivatedRoute } from '@angular/router';
import { ESDocumentConfig } from '../../models/document-config';
import { ESCustomFieldConfig, ESFieldConfig } from '../../models/field-data';
import { TemplateFactoryService } from '../../services/template-factory.service';
import { DocumentUtility } from '../../document-utility';
import { EsDocumentService } from '../../services/es-document.service';
import { ModelRoot, ModelProp } from '../../models/model-data';

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

  public form = new FormGroup({});
  public fields: ESFieldConfig[] = [];

  constructor(public esService: ElasticConnectionService, private route: ActivatedRoute, private documentService: EsDocumentService) {
    this.config = new ESDocumentConfig('My Form');
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
      this.model = this.documentService.parseModel(result, mapping);
      console.log(this.documentService.parseModel(result, mapping));
      this.updateFormConfig(mapping);
    }
  }

  updateFormConfig(mapping: ESMapping) {
    const newFields: ESFieldConfig[] = [];
    for(const prop of this.model.properties) {
      const formConfig = this.documentService.getConfig(prop, this.editFields);
      newFields.push(formConfig);
    }
    this.fields = [...newFields];
  }

  onSubmit() {
    console.log('saving');
  }
}
