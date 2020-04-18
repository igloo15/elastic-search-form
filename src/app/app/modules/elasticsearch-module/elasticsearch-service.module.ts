import { NgModule } from '@angular/core';
import { ElasticConnectionService } from '../../services/elastic-connection.service';

@NgModule({
    imports: [
    ],
    exports: [
        ElasticConnectionService
    ]
})
export class ElasticSearchServiceModule {}