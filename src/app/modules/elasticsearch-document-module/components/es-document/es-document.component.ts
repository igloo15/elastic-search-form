import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ElasticConnectionService } from '@igloo15/elasticsearch-angular-service';
import { ActivatedRoute, Router } from '@angular/router';
import { ESDocumentConfig, ESDocumentBuilder, ESDocumentStyleConfig, TitleType } from '../../models/document-config';
import { DocumentUtility } from '../../document-utility';
import { EsDocumentService, Row } from '../../services/es-document.service';
import { ModelRoot } from '../../models/model-data';
import { Subscription } from 'rxjs';


@Component({
  selector: 'es-document',
  templateUrl: './es-document.component.html',
  styleUrls: ['./es-document.component.scss']
})
export class EsDocumentComponent implements OnInit, OnDestroy {

  public model: ModelRoot;
  public isLoading = true;

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

  private _myConnSub: Subscription;
  private _myParamSub: Subscription;
  private _myUrlSub: Subscription;

  constructor(public esService: ElasticConnectionService, private route: ActivatedRoute,
    private documentService: EsDocumentService, private router: Router) {
  }

  ngOnInit(): void {
    if (!this.config) {
      this.config = this.documentService.getDefaultConfig();
      this.config.style.stretch = true;
      this.config.redirectToTable = true;
    }
    this._myUrlSub = this.route.url.subscribe(segments => {
      if (segments.length > 3) {
        this.config.disable = segments[2].path === 'view';
      }
    });
    this._myParamSub = this.route.paramMap.subscribe(params => {
      const indexName = params.get('index');
      if(indexName) {
        if (this.config.index !== indexName) {
          this.config = this.documentService.getIndexConfig(indexName);
        }
        this.index = indexName;
      }
      if (params.get('id')) {
        this.id = params.get('id');
      }
      this.queryES();
    });
    this._myConnSub = this.esService.isStarted.subscribe(async result => {
      if(result) {
        await this.queryES();
      }
    });
  }

  private async queryES() {
    this.isLoading = true;
    if(this.index && this.id) {
      const mapping = await this.esService.getMapping(this.index);
      const result = await this.esService.getById<any>(this.index, this.id);
      if (result && mapping) {
        this.model = this.documentService.parseModel(result, mapping);
        this.title = DocumentUtility.getTitle(this._config.title, this.model.value, '');
        this.updateFormConfig();
        this.isLoading = false;
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

  getStyle(config: ESDocumentStyleConfig) {
    return DocumentUtility.getStyle(config);
  }

  getTitle(title: TitleType) {
    return DocumentUtility.getTitle(title, this.model.value, '');
  }

  save() {
    const newModel = this.documentService.recreateData(this.model);
    console.log(newModel);
    this.esService.updateData(this.config.index, newModel, this.config.id);
    this.redirectConfig();
  }

  cancel() {
    this.redirectConfig();
  }

  private redirectConfig() {
    if (this.config.redirect) {
      this.router.navigate([this.config.redirect]);
      return;
    }
    if (this.config.redirectToTable) {
      this.router.navigate(['table', this.config.index]);
      return;
    }
  }

  ngOnDestroy() {
    this._myConnSub?.unsubscribe();
    this._myParamSub?.unsubscribe();
    this._myUrlSub?.unsubscribe();
  }
}
