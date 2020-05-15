import { Component } from '@angular/core';
import { ElasticConnectionService, } from '@igloo15/elasticsearch-angular-service';
import { DataGenerator } from './models/test-data';
import { TableConfig } from './modules/elasticsearch-table-module/model/table-config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'baseturn-game';
  answer = '';
  tableConfig = new TableConfig('test').addColumn({
    prop: 'friends',
    type: 'array'
  });

  constructor(private elasticService: ElasticConnectionService) {
    this.elasticService
      .start('http://192.168.50.215:9200')
      .then((value: string) => {
        this.answer = value;
        const myGenerator = new DataGenerator();
        const dataCount = 5;
        for(let i = 0; i < dataCount; i++) {
          this.elasticService.updateData('test', myGenerator.createBasicData());
        }
        this.elasticService.searchData('test', 'Jerod').then((result: any) => {
          this.answer = result;
        });

        this.elasticService.updateMapping('my-new-index', {
          properties: {
            myData: {
              type: 'date',
              meta: {
                array: 'false'
              }
            },
            newNumbers: {
              type: 'integer_range'
            },
            newIPs: {
              type: 'ip_range'
            },
            location: {
              type: 'geo_point'
            }
          }
        }).then((result: any) => {
          console.log(result);
        });
        setTimeout(() => {
          this.tableConfig.toggleColumn('age');
          this.tableConfig.showExpandColumn = false;
          this.tableConfig.showIdColumn = false;
        }, 10000);

    });
  }
}
