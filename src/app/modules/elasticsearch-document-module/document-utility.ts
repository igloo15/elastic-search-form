
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
}