
export type ModelTypes = 'string' | 'bool' | 'integer' | 'double' | 'object' | 'array' | 'date' | 'date_nanos';


export interface ModelProp {
    key: string;
    type: ModelTypes;
    value: any;
    childType?: ModelTypes;
    properties?: ModelProp[];
}

export interface ModelRoot {
    properties: ModelProp[];
    value: any;
}