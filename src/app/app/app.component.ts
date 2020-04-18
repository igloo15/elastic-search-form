import { Component } from '@angular/core';
import { ElasticConnectionService, ESMapping } from './modules/elasticsearch-module/public-api';
import { DataGenerator } from './models/test-data';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'baseturn-game';
  answer = '';

  constructor(private elasticService: ElasticConnectionService) {
    this.elasticService.start('http://192.168.50.215:9200').then((value: string) => {
      this.answer = value;
      const myGenerator = new DataGenerator();
      const dataCount = 5;
      for(let i = 0; i < dataCount; i++) {
        this.elasticService.updateData('test', myGenerator.createBasicData());
      }
      this.elasticService.getMapping('test').then((result: ESMapping) => {
        console.log(result);
      });
      this.elasticService.searchData('test', 'Jerod').then((result: any) => {
        console.log(result);
        this.answer = result;
      });

    });
  }
}
