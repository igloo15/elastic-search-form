import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Router } from '@angular/router';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from './modules/angular-material.module';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { AppComponent } from './app.component';
import { ElasticSearchServiceModule } from '@igloo15/elasticsearch-angular-service';
import { ElasticSearchTableModule, tableRoutes, TableConfig } from './modules/elasticsearch-table-module/public-api';
import { ElasticSearchDocumentModule, ESDocumentBuilder, ESDocumentConfig, ESDocumentConfigCollection } from './modules/elasticsearch-document-module/public-api';
import { NgxJsonViewerModule } from 'ngx-json-viewer';

const documentConfig: ESDocumentConfig = new ESDocumentBuilder('', '', 'My Amazing Form')
.addRow('Row One')
.addStyle({stretch: true})
.addItem({ key: 'testData.isEnabled', type: 'toggle', style: { width:'500px' }})
.addItem({ key: 'testData.date', type: 'datepicker', title: 'My Date'})
.done()
.addRow('Row Two')
.addItem({ key: 'testDouble', numOptions: [4, 13.4, 13, 1341.3, 85740], valueFromDisplay: (data) => {
  let sum = 1;
  for(const item of data) {
    sum = sum * item;
  }
  return sum;
}, valueToDisplay: (data) => [data.model.value],multiSelect: true, type:'select'})
.addItem({ key: 'testDouble', min: 0, max: 100000, interval: 4.73, verticalSlider: false, sliderTooltip:true, type:'slider', title: 'My Other Value'})
.addItem({ key: 'testDouble', type:'number', title: 'My Actual Value', min: 0, max: 90000})
.done()
.addRow((data) => data.testText)
.addStyle({stretch: true})
.addItem({key: 'testText', type:'input', title: 'My Short Title', stringLimit: 100, showTextArea: true, style:{stretch: true}})
.done()
.build();

const docConfig = new ESDocumentBuilder('new-test', '', 'My Amazing Form')
.setRedirect('', true)
.addRow('')
.addStyle({stretch: true})
.addItem({key: 'testText', type:'select', title:'My Data', stringOptions:['test', 'test1', 'test2', 'test3'],  style: {stretch: true}})
.done()
.build();
const collectionConfig: ESDocumentConfigCollection = {
  indexConfigs: {
    'new-test': docConfig
  }
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot([], { useHash: true }),
    MaterialModule,
    FlexLayoutModule,
    FormsModule,
    HttpClientModule,
    DragDropModule,
    ElasticSearchServiceModule,
    ElasticSearchTableModule.forRoot(),
    ElasticSearchDocumentModule.forRoot(),
    NgxJsonViewerModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: []
})
export class AppModule { }
