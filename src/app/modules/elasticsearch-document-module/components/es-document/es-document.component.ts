import { Component, OnInit, Input } from '@angular/core';
import { ElasticConnectionService } from '@igloo15/elasticsearch-angular-service';
import { ActivatedRoute, Router } from '@angular/router';
import { ESDocumentConfig, ESDocumentBuilder, ESDocumentStyleConfig } from '../../models/document-config';
import { DocumentUtility } from '../../document-utility';
import { EsDocumentService, Row } from '../../services/es-document.service';
import { ModelRoot } from '../../models/model-data';


@Component({
  selector: 'es-document',
  templateUrl: './es-document.component.html',
  styleUrls: ['./es-document.component.scss']
})
export class EsDocumentComponent implements OnInit {

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

  constructor(public esService: ElasticConnectionService, private route: ActivatedRoute,
    private documentService: EsDocumentService, private router: Router) {
    this.config = new ESDocumentBuilder('', '', 'My Form').build();
    this.config.style.stretch = true;
    this.config.redirect = '/table/test';
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

  private async queryES() {
    if(this.index && this.id) {
      const mapping = await this.esService.getMapping(this.index);
      const result = await this.esService.getById<any>(this.index, this.id);
      if (result && mapping) {
        this.model = this.documentService.parseModel(result, mapping);
        console.log(this.model);
        this.title = DocumentUtility.getTitle(this._config.title, this.model.value);
        this.updateFormConfig();
      }
    }
  }

  private updateFormConfig() {
    if (this._config.fields.length > 0) {
      this.rows = [...this.documentService.parseWithConfig(this.model, this.config)];
    } else {
      this.rows = [...this.documentService.parseWithoutConfig(this.model, this.config)];
    }
  }

  private getStyle(config: ESDocumentStyleConfig) {
    return DocumentUtility.getStyle(config);
  }

  private save() {
    const newModel = this.documentService.recreateData(this.model);
    console.log(newModel);
    this.esService.updateData(this.config.index, newModel, this.config.id);
    this.redirectConfig();
  }

  private cancel() {
    this.redirectConfig();
  }

  private redirectConfig() {
    if (this.config.redirect) {
      this.router.navigate([this.config.redirect]);
    }
  }
}
