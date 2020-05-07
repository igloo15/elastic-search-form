import { InjectionToken } from '@angular/core';
import { TableConfig } from './model/table-config';

export const EsTableConfigService = new InjectionToken<TableConfig>('TableConfig');