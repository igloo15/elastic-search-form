import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Router } from '@angular/router';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from './modules/angular-material.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';

import { AppComponent } from './app.component';
import { ElasticSearchServiceModule } from '@igloo15/elasticsearch-angular-service';
import { ElasticSearchTableModule, tableRoutes, TableConfig } from './modules/elasticsearch-table-module/public-api';
import { NgxJsonViewerModule } from 'ngx-json-viewer';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot([...tableRoutes], { useHash: true }),
    MaterialModule,
    FlexLayoutModule,
    FormsModule,
    HttpClientModule,
    DragDropModule,
    FormlyModule.forRoot(),
    FormlyMaterialModule,
    ElasticSearchServiceModule,
    ElasticSearchTableModule.forRoot(new TableConfig('test')),
    NgxJsonViewerModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: []
})
export class AppModule { }
