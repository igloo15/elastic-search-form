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
  tableConfig = new TableConfig('test', {
    friends: {
      prop: 'friends',
      type: 'array'
    }
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

        this.elasticService.updateMapping('my-index', {
          properties: {
            newStuff: {
              type: 'long',
              meta: {
                array: 'false'
              }
            },
            newString: {
              type: 'text'
            }
          }
        }).then((result: any) => {
          console.log(result);
        });
        setTimeout(() => {
          this.tableConfig.toggleColumn('age');
        }, 10000);

    });
  }
}
