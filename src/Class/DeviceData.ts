/**
 * @description 设备数据实体类
 */
export class DeviceData {
    public dataValue!: string;
    public categoryID!: number;

    constructor(dataValue: string, categoryID: number) {
        this.categoryID = categoryID;
        this.dataValue = dataValue;
    }
}