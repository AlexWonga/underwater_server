export interface twoDimensionalBody{
    rowName:string;//横坐标
    columnName:string;//纵坐标
    data:twoDimensionalData[];
}

export interface twoDimensionalData{
    row:number;
    column:number;
}