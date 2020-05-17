import { ESField, ESFieldData } from './field-data';
import { DocumentUtility } from '../document-utility';

export abstract class EsComponentBase implements ESField {
    _data: ESFieldData;

    get data(): ESFieldData {
        return this._data;
    }

    set data(val: ESFieldData) {
        this._data = val;
        this.onDataSet();
    }

    onDataSet() { }

    getStyle() {
        return DocumentUtility.getStyle(this.data.config.style);
    }

    getValue() {
        if (this._data.config?.valueParser) {
            return this._data.config.valueParser(this._data);
        }
        return this.data.model.value;
    }

    setValue(value: any) {
        if (this._data.config?.valueSaver) {
            this.data.model.value = this._data.config.valueSaver(value);
        } else {
            this.data.model.value = value;
        }
    }

    onChange(event: any) {
        this.setValue(event.target.value);
    }
}