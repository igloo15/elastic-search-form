import { TitleType, ESDocumentStyleConfig } from './models/document-config';

export class DocumentUtility {
    static getValue(key: string[], model: any) {
        let returnValue: any;
        for (const keyValue of key) {
            returnValue = model[keyValue];
        }
        return returnValue;
    }

    static setValue(key: string[], model: any, value: any) {
        for (const keyValue of key) {
            model[keyValue] = value;
        }
    }

    static capitalize = (s) => {
        if (typeof s !== 'string') return ''
        return s.charAt(0).toUpperCase() + s.slice(1)
    }

    static getTitle(title: TitleType, model: any): string {
        if (typeof title === 'string') return title;
        return title(model);
    }

    static getStyle(config: ESDocumentStyleConfig): string {
        let width = 'width:""';
        let height = 'height:""';
        if (config.width) {
            width = `width:${config.width}`;
        }
        if (config.height) {
            height = `height:${config.height}`;
        }
        if (config.stretch) {
            width = `width:100%`;
            height = `height:100%`;
        }

        return `${width};${height};box-sizing:border-box;`;
    }
}