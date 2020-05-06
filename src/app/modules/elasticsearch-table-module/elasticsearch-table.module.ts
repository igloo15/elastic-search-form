import { NgModule } from '@angular/core';
import { RouterModule , Routes } from '@angular/router';
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
import { EsTableViewComponent } from './components/es-table-view/es-table-view.component';

const childRoutes: Routes = [
    { path: 'table/:index/:offset', component: EsTableComponent }
];


@NgModule({
    declarations: [
        EsTableComponent,
        TableConfigDialogComponent,
        EsTableViewComponent
    ],
    imports: [
        BrowserModule,
        RouterModule.forChild(childRoutes),
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
        NgxJsonViewerModule
    ],
    exports: [
        EsTableComponent,
        RouterModule
    ]
})
export class ElasticSearchTableModule {}