import { InjectionToken } from '@angular/core';
import { TableConfigCollection } from './model/table-config';

export const EsTableConfigService = new InjectionToken<TableConfigCollection>('TableConfigCollection');