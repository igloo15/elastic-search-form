import { ESField, ESFieldData } from './field-data';
import { DocumentUtility } from '../document-utility';

export class EsComponentBase implements ESField {
    data: ESFieldData;

    getStyle() {
        return DocumentUtility.getStyle(this.data.config.style);
    }

    getValue() {
        return this.data.model.value;
    }

    setValue(value: any) {
        this.data.model.value = value;
    }
}