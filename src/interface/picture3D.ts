import {Device} from "../database/Models/DeviceModel";

export interface Picture3D {
    picturePath: string;
    deviceID: number;
    device: Device;
}