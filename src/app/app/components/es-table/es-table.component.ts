import { Component, OnInit, Input } from '@angular/core';
import { ElasticConnectionService, ESMapping } from '../../modules/elasticsearch-module/public-api';

@Component({
  selector: 'es-table',
  templateUrl: './es-table.component.html',
  styleUrls: ['./es-table.component.scss']
})
export class EsTableComponent implements OnInit {

  @Input()
  public index: string;

  public items: any[];

  private _service: ElasticConnectionService;
  private _mappings: ESMapping;

  constructor(service: ElasticConnectionService) {
    this._service = service;
    this.items = [];
  }

  async ngOnInit(): Promise<void> {
    if(this.index) {
      this._service.isStarted.subscribe(async (result) => {
        this._mappings = await this._service.getMapping(this.index);
        this.items = await this._service.getAll(this.index);
      });
    }
  }

}
