import { ModuleWithProviders, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ElasticConnectionService } from './services/elastic-connection.service';

@NgModule({
    declarations: [
    ],
    imports: [
        BrowserModule
    ],
    exports: [
    ]
})
export class ElasticSearchServiceModule {
    public static forRoot(): ModuleWithProviders<ElasticSearchServiceModule> {
        return {
            ngModule: ElasticSearchServiceModule,
            providers: [ElasticConnectionService]
        }
    }
}