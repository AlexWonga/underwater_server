import {Device as DeviceModel} from "../Class/Device";
import {DeviceData as DeviceDataModel} from "../Class/DeviceData";


export interface DeviceInfo {
    device: DeviceModel,
    deviceDataList: DeviceDataModel[],
}

