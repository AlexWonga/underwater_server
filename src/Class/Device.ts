export class Device {
    public deviceID: number;//设备ID
    public manufacturerID: number;//厂商ID
    public deviceName: string;//设备名
    public creationTime: number;//创建时间
    public lastModifiedTime: number;//最后修改时间
    public userID:number


    constructor(deviceID: number, manufacturerID: number, deviceName: string, creationTime: number, lastModifiedTime: number, userID: number) {
        this.deviceID = deviceID;
        this.manufacturerID = manufacturerID;
        this.deviceName = deviceName;
        this.creationTime = creationTime;
        this.lastModifiedTime = lastModifiedTime;
        this.userID = userID;
    }
}