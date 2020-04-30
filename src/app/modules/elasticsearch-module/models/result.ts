export interface ESSearchResults<T> {
    count: number;
    score: number;
    items: T[];
}