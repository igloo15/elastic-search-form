import { InjectionToken } from '@angular/core';
import { ESDocumentConfig } from './models/document-config';

export const EsDocumentConfigService = new InjectionToken<ESDocumentConfig>('ESDocumentConfig');