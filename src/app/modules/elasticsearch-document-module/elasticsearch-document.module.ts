import { NgModule, ModuleWithProviders } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, Router } from '@angular/router';
import { EsDocumentComponent } from './components/es-document/es-document.component';
import { ReactiveFormsModule } from '@angular/forms';
import { EsFieldWrapperComponent } from './components/es-field-wrapper/es-field-wrapper.component';
import { EsFieldHostDirective } from './components/es-field-host.directive';
import { EsFieldInputComponent } from './components/es-field-input/es-field-input.component';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatSliderModule } from '@angular/material/slider';
import { MatNativeDateModule } from '@angular/material/core';
import { EsFieldToggleComponent } from './components/es-field-toggle/es-field-toggle.component';
import { EsFieldChipsComponent } from './components/es-field-chips/es-field-chips.component';
import { EsFieldNumberInputComponent } from './components/es-field-number-input/es-field-number-input.component';
import { EsFieldDateComponent } from './components/es-field-date/es-field-date.component';
import { NgxMatDatetimePickerModule, NgxMatNativeDateModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';
import { ESDocumentConfig, ESDocumentBuilder, ESDocumentConfigCollection } from './models/document-config';
import { EsDocumentConfigService } from './elasticsearch-document-token.config';
import { EsFieldSelectComponent } from './components/es-field-select/es-field-select.component';
import { EsFieldSliderComponent } from './components/es-field-slider/es-field-slider.component';
import { EsFieldTableComponent } from './components/es-field-table/es-field-table.component';
import { DeCamelCasePipe } from './pipes/de-camel-case.pipe';
import { ElasticSearchServiceModule } from '@igloo15/elasticsearch-angular-service';

export const documentRoutes: Routes = [
    { path: 'document/:index/view/:id', component: EsDocumentComponent},
    { path: 'document/:index/edit/:id', component: EsDocumentComponent}
]

@NgModule({
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        MatInputModule,
        MatChipsModule,
        MatIconModule,
        MatButtonModule,
        MatDialogModule,
        MatSlideToggleModule,
        MatSelectModule,
        MatDatepickerModule,
        MatCardModule,
        MatProgressSpinnerModule,
        MatSliderModule,
        NgxMatDatetimePickerModule,
        NgxMatNativeDateModule,
        NgxMatTimepickerModule,
        MatNativeDateModule,
        ElasticSearchServiceModule.forRoot()
    ],
    exports: [
    ],
    declarations: [EsDocumentComponent, EsFieldWrapperComponent, EsFieldHostDirective, EsFieldInputComponent,
        EsFieldToggleComponent, EsFieldChipsComponent, EsFieldNumberInputComponent, EsFieldDateComponent, 
        EsFieldSelectComponent, EsFieldSliderComponent, EsFieldTableComponent, DeCamelCasePipe]
})
export class ElasticSearchDocumentModule {
    constructor(router: Router) {
        router.config.push(...documentRoutes);
    }

    static forRoot(config?: ESDocumentConfig | ESDocumentConfigCollection): ModuleWithProviders<ElasticSearchDocumentModule> {
        config = config ?? new ESDocumentBuilder().build();
        let localConfigCollection = config as ESDocumentConfigCollection;
        if (!localConfigCollection.indexConfigs) {
            localConfigCollection = { default: config as ESDocumentConfig, indexConfigs: {} };
        }
        return {
            ngModule: ElasticSearchDocumentModule,
            providers: [
                {
                    provide: EsDocumentConfigService,
                    useValue: localConfigCollection
                }
            ]
        };
    }
}