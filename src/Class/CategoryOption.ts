/**
 * @description 设备数据类型选择类型
 */

export class CategoryOption {
    public optionsName: string;
    public categoryID: number;

    constructor(optionsName: string, categoryID: number) {
        this.categoryID = categoryID;
        this.optionsName = optionsName;
    }
}