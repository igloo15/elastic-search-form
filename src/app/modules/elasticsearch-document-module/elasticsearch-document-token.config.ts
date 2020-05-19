import { InjectionToken } from '@angular/core';
import { ESDocumentConfig, ESDocumentConfigCollection } from './models/document-config';

export const EsDocumentConfigService = new InjectionToken<ESDocumentConfigCollection>('ESDocumentConfigCollection');