/**
 * @description 设备数据类型选择类型
 */

export class CategoryOption {
    public optionsName: string;
    public categoryID: number;

    constructor(optionName: string, foreignID: number) {
        this.categoryID = foreignID;
        this.optionsName = optionName;
    }
}