import {DeviceData} from "./Models/DeviceDataModel";
import {Device} from "./Models/DeviceModel";
import {ResponseDB} from "../instances/ResponseDB";
import {DataCategory} from "./Models/DataCategoryModel";


export async function uploadTwoDimensionalData(data: string, deviceID: number, categoryID: number): Promise<ResponseDB<void>> {
    const device = await Device.findOne({
        where: {
            ID: deviceID,
        }
    });
    if (device) {//设备存在，可以插入二维数据
        const category = await DataCategory.findOne({
            where: {
                ID: categoryID,
            }
        });
        if (category) {
            const result = await DeviceData.create({
                data: data,
                categoryID: categoryID,
                deviceID: deviceID,
            });
            if (result) {
                return new ResponseDB<void>(true, 'uploadSuccess');
            } else {
                throw new Error("insertTwoDimensionDataFailed");
            }
        } else {
            return new ResponseDB<void>(false, 'invalidCategory');
        }
    } else {
        return new ResponseDB<void>(false, 'invalidDevice');
    }
}

export async function deleteTwoDimensionalData(categoryID: number, deviceID: number): Promise<ResponseDB<void>> {//删除指定设备的二维数据
    const device = await Device.findOne({
        where: {
            ID: deviceID,
            isInRecycleBin: false,
        }
    });
    if (device) {
        const category = await Device.findOne({
            where: {
                ID: categoryID,
                isInRecycleBin: false,
            }
        });
        if (category) {
            const data = await DeviceData.findOne({
                where: {
                    categoryID: categoryID,
                    deviceID: deviceID,
                }
            });
            if (data) {
                await data.destroy();

                return new ResponseDB<void>(true, 'deleteTwoDimensionalDataSuccess');
            } else {
                return new ResponseDB<void>(false, 'noSuchData');
            }
        } else {
            return new ResponseDB<void>(false, 'invalidCategory');
        }
    } else {
        return new ResponseDB<void>(false, 'invalidDevice');
    }
}