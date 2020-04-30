import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { EsTableComponent } from './components/es-table/es-table.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ElasticSearchServiceModule } from '@igloo15/elasticsearch-angular-service';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NgxJsonViewerModule } from 'ngx-json-viewer';


@NgModule({
    declarations: [
        EsTableComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        MatInputModule,
        MatChipsModule,
        MatIconModule,
        MatButtonModule,
        NgxDatatableModule,
        ElasticSearchServiceModule,
        NgxJsonViewerModule
    ],
    exports: [
        EsTableComponent
    ]
})
export class ElasticSearchTableModule {}