
export interface ESMetaField {
    [key: string]: string;
}

export interface ESStringField {
    keyword: { type: string, ignore_above: number}
}

export interface ESSubProperty {
    type: string;
    properties?: ESPropertyArray;
    fields?: ESStringField;
    meta?: ESMetaField;
}

export interface ESPropertyArray {
    [key: string]: ESSubProperty;
}
export interface ESMapping {
    properties?: ESPropertyArray;
}