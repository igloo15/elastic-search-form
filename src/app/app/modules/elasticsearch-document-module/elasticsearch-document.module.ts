import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ElasticConnectionService } from '../../services/elastic-connection.service';

@NgModule({
    imports: [
        BrowserModule
    ],
    exports: [
        ElasticConnectionService
    ]
})
export class ElasticSearchDocumentModule {}