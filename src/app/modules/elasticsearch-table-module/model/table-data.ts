import { SortItem } from '@igloo15/elasticsearch-angular-service';

export class TableData {
    totalCount = 0;
    offset = 0;
    limit = 10;
    sortItem?: SortItem;
    showIdField = true;
}