
export interface ESStringField {
    keyword: { type: string, ignore_above: number}
}

export interface ESSubProperty {
    type: string;
    properties?: ESProperty[];
    fields?: ESStringField;
}

export interface ESProperty {
    [key: string]: ESSubProperty;
}
export interface ESMapping {
    properties?: ESProperty;
}