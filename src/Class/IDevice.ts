import {DeviceData} from "./DeviceData";

/**
 * @description 设备添加数据用 Device类
 */
export class IDevice{
    public deviceID:number;
    public deviceName:string|undefined;
    public manufacturerID:number|undefined;
    public deviceDataList:DeviceData[]|undefined;
    public userID:number|undefined;


    constructor(deviceID: number, deviceName: string | undefined, manufacturerID: number | undefined, deviceDataList: DeviceData[] | undefined, userID: number | undefined) {
        this.deviceID = deviceID;
        this.deviceName = deviceName;
        this.manufacturerID = manufacturerID;
        this.deviceDataList = deviceDataList;
        this.userID = userID;
    }
}