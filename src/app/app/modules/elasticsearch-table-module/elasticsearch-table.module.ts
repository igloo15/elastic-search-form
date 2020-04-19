import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { EsTableComponent } from '../../components/es-table/es-table.component';
import { ElasticSearchServiceModule } from '../elasticsearch-module/public-api'


@NgModule({
    declarations: [
        EsTableComponent
    ],
    imports: [
        BrowserModule,
        ElasticSearchServiceModule
    ],
    exports: [
        EsTableComponent
    ]
})
export class ElasticSearchTableModule {}