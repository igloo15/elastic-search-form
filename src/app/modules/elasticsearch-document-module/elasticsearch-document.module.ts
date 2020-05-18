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
import { EsFieldToggleComponent } from './components/es-field-toggle/es-field-toggle.component';
import { EsFieldChipsComponent } from './components/es-field-chips/es-field-chips.component';
import { EsFieldNumberInputComponent } from './components/es-field-number-input/es-field-number-input.component';
import { EsFieldDateComponent } from './components/es-field-date/es-field-date.component';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { NgxMatDatetimePickerModule, NgxMatNativeDateModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';
import { ESDocumentConfig, ESDocumentBuilder } from './models/document-config';
import { EsDocumentConfigService } from './elasticsearch-document-token.config';

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
        NgxMatDatetimePickerModule,
        NgxMatNativeDateModule,
        NgxMatTimepickerModule,
        MatNativeDateModule
    ],
    exports: [
    ],
    declarations: [EsDocumentComponent, EsFieldWrapperComponent, EsFieldHostDirective, EsFieldInputComponent,
        EsFieldToggleComponent, EsFieldChipsComponent, EsFieldNumberInputComponent, EsFieldDateComponent]
})
export class ElasticSearchDocumentModule {
    constructor(router: Router) {
        router.config.push(...documentRoutes);
    }

    static forRoot(config?: ESDocumentConfig): ModuleWithProviders {
        config = config ?? new ESDocumentBuilder().build();
        return {
            ngModule: ElasticSearchDocumentModule,
            providers: [
                {
                    provide: EsDocumentConfigService,
                    useValue: config
                }
            ]
        };
    }
}