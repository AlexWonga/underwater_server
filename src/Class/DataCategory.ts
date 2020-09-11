import {DataType} from "../Enum/DataType";

export class DataCategory {
    public dataCategoryID: number;
    public dataCategoryName: string;
    public dataType: DataType;
    //public selectList?: string[];
    //没有是否在回收站选项

    constructor(dataCategoryID: number, dataCategoryName: string, dataType: DataType) {
        this.dataCategoryID = dataCategoryID;
        this.dataType = dataType;
        this.dataCategoryName = dataCategoryName;
        //this.selectList = selectList;
    }
}