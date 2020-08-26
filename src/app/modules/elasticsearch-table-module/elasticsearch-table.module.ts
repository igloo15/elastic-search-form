import { NgModule, ModuleWithProviders } from '@angular/core';
import { Router, Routes, RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { EsTableComponent } from './components/es-table/es-table.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ElasticSearchServiceModule } from '@igloo15/elasticsearch-angular-service';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { TableConfigDialogComponent } from './components/table-config-dialog/table-config-dialog.component';
import { TableConfig, TableConfigCollection } from './model/table-config';
import { EsTableConfigService } from './elasticsearch-table.config';

export const tableRoutes: Routes = [
    { path: 'table/:index/:offset', component: EsTableComponent },
    { path: 'table/:index', component: EsTableComponent }
];

@NgModule({
    declarations: [
        EsTableComponent,
        TableConfigDialogComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        MatInputModule,
        MatChipsModule,
        MatIconModule,
        MatButtonModule,
        MatDialogModule,
        MatSlideToggleModule,
        MatSelectModule,
        NgxDatatableModule,
        ElasticSearchServiceModule,
        NgxJsonViewerModule,
        RouterModule
    ],
    exports: [
        EsTableComponent,
        TableConfigDialogComponent
    ]
})
export class ElasticSearchTableModule {
    constructor(router: Router) {
        router.config.push(...tableRoutes);
    }
    static forRoot(config?: TableConfig | TableConfigCollection): ModuleWithProviders<ElasticSearchTableModule> {
        config = config ?? new TableConfig('');
        let configCollection = config as TableConfigCollection;
        if (!configCollection.indexConfigs) {
            configCollection = { default: config as TableConfig, indexConfigs: {} };
        }
        return {
            ngModule: ElasticSearchTableModule,
            providers: [
                {
                    provide: EsTableConfigService,
                    useValue: configCollection
                }
            ]
        };
    }
}