import { ESFieldComponent, ESFieldData } from './field-data';
import { DocumentUtility } from '../document-utility';

export abstract class EsComponentBase implements ESFieldComponent {
    _data: ESFieldData;

    get data(): ESFieldData {
        return this._data;
    }

    set data(val: ESFieldData) {
        this._data = val;
        this.onDataSet();
    }

    onDataSet() { }

    getTitle() {
        return DocumentUtility.getTitle(this.data.config.title, this.data?.model?.value, this.data.model.key);
    }

    getStyle() {
        return DocumentUtility.getStyle(this.data.config.style);
    }

    getValue() {
        if (this._data.config?.valueToDisplay) {
            return this._data.config.valueToDisplay(this._data);
        }
        return this.data.model.value;
    }

    setValue(value: any) {
        if (this._data.config?.valueFromDisplay) {
            this.data.model.value = this._data.config.valueFromDisplay(value);
        } else {
            this.data.model.value = value;
        }
    }

    onChange(event: any) {
        this.setValue(event.target.value);
    }
}