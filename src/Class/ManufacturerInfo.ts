/**
 * @description 厂商实体类
 */

export class ManufacturerInfo {
    public manufacturerID!: number;
    public manufacturerName!: string;
    public manufacturerAddress!: string;
    public manufacturerIntroduction!: string;
    public manufacturerTelephone!: string;

    constructor(manufacturerID: number, manufacturerName: string, manufacturerAddress: string, manufacturerIntroduction: string, manufacturerTelephone: string) {
        this.manufacturerID = manufacturerID;
        this.manufacturerAddress = manufacturerAddress;
        this.manufacturerIntroduction = manufacturerIntroduction;
        this.manufacturerTelephone = manufacturerTelephone;
        this.manufacturerName = manufacturerName;
    }
}
