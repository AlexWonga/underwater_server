import {DeviceData as DeviceDataModel} from "../Class/DeviceData";
import {Device as DeviceModel} from '../Class/Device';
import {Device, DevicePicture, DeviceFile, DevicePicture3D} from "./Models/DeviceModel";
import {UserInfo} from "./Models/UserSupervisorModel";
import {DeviceData} from "./Models/DeviceDataModel";
import {Manufacturer} from "./Models/ManufacturerModel";
import {DataCategory} from "./Models/DataCategoryModel";
import {ResponseDB} from "../instances/ResponseDB";
import {sequelize} from "./DB";
import * as path from "path";
import {Op} from "sequelize";
import {utilx} from "../instances/utilx";
import * as fse from "fs-extra";
import {filesDir, deviceAttachmentDir, devicePicturesDir, rootDirPath} from '../config/filePaths';
import {Picture3D} from "../interface/picture3D";
import {DeviceInfo} from "../interface/DeviceInfo";
import {PictureInfo} from "../Class/PictureInfo";
import {AttachmentInfo} from "../Class/AttachmentInfo";
import {File} from "formidable"

class deviceData { //这个类用于将数据存入数据库
    public data: string;
    public deviceID: number;
    public categoryID: number;


    constructor(data: string, deviceID: number, dataCategoryID: number) {
        this.data = data;
        this.deviceID = deviceID;
        this.categoryID = dataCategoryID;
    }
}

export async function addDevice(deviceName: string, manufacturerID: number, deviceAdminID: number, deviceDataList?: DeviceDataModel[]): Promise<ResponseDB<number>> {
    const t = await sequelize.transaction();
    try {
        const admin = await UserInfo.findOne({
            where: {
                ID: deviceAdminID,
            }
        });
        if (admin === null) {
            return new ResponseDB<number>(false, 'invalidDeviceAdmin');
        } else {
            const manufacturer = await Manufacturer.findOne({
                where: {
                    ID: manufacturerID,
                }
            });
            if (manufacturer === null) {
                return new ResponseDB<number>(false, 'invalidManufacturer');
            }
            if (deviceName === '') {
                return new ResponseDB<number>(false, 'invalidDeviceName');
            }
            const device = await Device.create({
                deviceName: deviceName,
                userInfoID: deviceAdminID,
                manufacturerID: manufacturerID,
            });
            const {ID} = device;//新添加的设备ID
            if (deviceDataList) {
                const categoryIDListTemp = await DataCategory.findAll({
                    attributes: ['ID'],
                });//找到所有categoryID
                const categoryIDList: number[] = [];
                categoryIDListTemp.forEach((item: any) => {
                    categoryIDList.push(item.ID);
                });
                const flag = deviceDataList.every((item) => {
                    return categoryIDList.indexOf(item.categoryID) > -1;
                })
                if (!flag) {
                    return new ResponseDB<number>(false, 'invalidCategory');
                }

                const dataList: deviceData[] = [];
                deviceDataList.forEach((item: DeviceDataModel) => {
                    dataList.push(new deviceData(item.dataValue, ID, item.categoryID));
                });

                await DeviceData.bulkCreate(dataList);
                await t.commit();
                return new ResponseDB<number>(true, 'addDeviceSuccess', ID);
            } else {
                await t.commit();
                return new ResponseDB<number>(true, 'addDeviceSuccess', ID);
            }
        }
    } catch (e) {
        await t.rollback();
        throw e;
    }
}


export async function modifyDevice(deviceID: number, deviceName: string, manufacturerID: number, deviceDataList: DeviceDataModel[], deviceAdminID: number): Promise<ResponseDB<void>> {
    const t = await sequelize.transaction();
    try {
        if (deviceName === '') {
            await t.rollback();
            return new ResponseDB<void>(false, 'invalidDeviceName');
        }
        let manufacturer = await Manufacturer.findOne({ //检查传入的厂商ID是否存在
            where: {
                ID: manufacturerID,
            }
        });
        if (manufacturer === null) {
            await t.rollback();
            return new ResponseDB<void>(false, 'invalidManufacturer');
        }
        let res = await Device.findOne({ //检查要修改的设备是否存在
            where: {
                ID: deviceID,
            },
        });
        if (res === null) {
            await t.rollback();
            return new ResponseDB<void>(false, 'DeviceNotExist');
        }
        let User = await UserInfo.findOne({ //检查指定的设备管理员是否存在
            where: {
                ID: deviceAdminID,
            },
        });
        if (User === null) {
            await t.rollback();
            return new ResponseDB<void>(false, 'invalidDeviceAdminID');
        } else {
            //所有数据都是合法的 进行设备的修改操作
            res.deviceName = deviceName;
            res.manufacturerID = manufacturerID;
            res.manufacturer = manufacturer;
            const DataList = await DeviceData.findAll({
                where: {
                    DeviceID: deviceID,
                }
            });

            for (let i = 0; i < deviceDataList.length; i++) {
                let flag: boolean = false;
                for (let j = 0; j < DataList.length; j++) {
                    if (deviceDataList[i].categoryID === DataList[j].categoryID) {
                        DataList[j].data = deviceDataList[i].dataValue;
                        await DataList[j].save();
                        flag = true;
                    }
                }
                if (!flag) {
                    await DeviceData.create({
                        data: deviceDataList[i].dataValue,
                        categoryID: deviceDataList[i].categoryID,
                        deviceID: deviceID,
                    });
                }
            }

            res.userInfoID = deviceAdminID;
            res.userInfo = User;
            await res.save();
            await t.commit();
            return new ResponseDB<void>(true, 'modifyDeviceSuccess');
        }
    } catch (e) {
        await t.rollback();
        throw e;
    }
}

export async function deleteDevice(deviceID: number): Promise<ResponseDB<void>> {
    let device = await Device.findOne({
        where: {
            ID: deviceID,
            isInRecycleBin: false,
        }
    });
    if (device) {
        device.isInRecycleBin = true;
        await device.save();
        return new ResponseDB<void>(true, 'deviceDeleted');
    } else {//设备不存在
        return new ResponseDB<void>(false, 'deviceNotFound');
    }
}

export async function deletedDeviceRecover(deviceID: number): Promise<ResponseDB<void>> {
    let device = await Device.findOne({
        where: {
            ID: deviceID,
            isInRecycleBin: true,
        }
    });
    if (device) {
        device.isInRecycleBin = false;
        await device.save();
        return new ResponseDB<void>(true, 'deviceRecovered')
    } else {
        return new ResponseDB<void>(false, 'deviceNotFound');
    }
}

export async function listDevice(offset: number, limit: number): Promise<ResponseDB<DeviceModel[]>> {
    const deviceList = await Device.findAll({
        limit: limit,
        offset: offset,
        order: ['ID'],
        where: {
            isInRecycleBin: false,//不在回收站内
        },
    });
    if (deviceList) {
        let result: DeviceModel[] = [];
        deviceList.forEach((item) => {
            const {ID, manufacturerID, deviceName, createdAt, updatedAt, userInfoID} = item;
            result.push(new DeviceModel(ID, manufacturerID, deviceName, createdAt.getTime(), updatedAt.getTime(), userInfoID));
        });
        return new ResponseDB<DeviceModel[]>(true, 'listDeviceSuccess', result);
    } else {
        return new ResponseDB<DeviceModel[]>(true, 'listDeviceSuccess');
    }
}

export async function listDeviceOnID(offset: number, limit: number, userID: number) {
    const deviceList = await Device.findAll({
        offset: offset,
        limit: limit,
        order: ['ID'],
        where: {
            isInRecycleBin: false,
            userInfoID: userID,
        }
    });
    if (deviceList) {
        let result: DeviceModel[] = [];
        deviceList.forEach((item) => {
            const {ID, manufacturerID, deviceName, createdAt, updatedAt, userInfoID} = item;
            result.push(new DeviceModel(ID, manufacturerID, deviceName, createdAt.getTime(), updatedAt.getTime(), userInfoID));
        });
        return new ResponseDB<DeviceModel[]>(true, 'listDeviceSuccess', result);

    } else {
        return new ResponseDB<DeviceModel[]>(true, 'listDeviceSuccess');
    }
}

export async function listDeletedDevice(offset: number, limit: number): Promise<ResponseDB<DeviceModel[]>> {
    const deviceList = await Device.findAll({
        limit: limit,
        offset: offset,
        order: ['ID'],
        where: {
            isInRecycleBin: true,//在回收站内
        },
    });
    if (deviceList) {
        let result: DeviceModel[] = [];
        deviceList.forEach((item) => {
            const {ID, manufacturerID, deviceName, createdAt, updatedAt, userInfoID} = item;
            result.push(new DeviceModel(ID, manufacturerID, deviceName, createdAt.getTime(), updatedAt.getTime(), userInfoID));
        });
        return new ResponseDB<DeviceModel[]>(true, 'listDeletedDeviceSuccess', result);
    } else {
        return new ResponseDB<DeviceModel[]>(true, 'listDeletedDeviceSuccess');
    }
}

export async function searchDevice(keyword?: string, deviceDataList?: DeviceDataModel[]): Promise<ResponseDB<DeviceModel[]>> {
    if (keyword && deviceDataList) {//两个参数都有
        return new ResponseDB<DeviceModel[]>(false, 'invalidParameter');
    } else if (keyword) {
        const DeviceListF = await Device.findAll({
            where: {
                isInRecycleBin: false,
                deviceName: {[Op.like]: '%' + keyword + '%'},
            }
        });
        const result: DeviceModel[] = [];
        DeviceListF.forEach((item) => {
            const {ID, manufacturerID, deviceName, createdAt, updatedAt, userInfoID} = item;
            result.push(new DeviceModel(ID, manufacturerID, deviceName, createdAt.getTime(), updatedAt.getTime(), userInfoID));
        });
        return new ResponseDB<DeviceModel[]>(true, 'searchDeviceSuccess', result);
    } else if (deviceDataList) {//有数据
        return new ResponseDB<DeviceModel[]>(true, 'searchDeviceSuccess');
    } else {//两个参数都没有的情况
        return new ResponseDB<DeviceModel[]>(true, 'searchDeviceSuccess');
    }
}

export async function searchDeletedDevice(keyword: string): Promise<ResponseDB<DeviceModel[]>> {
    const DeviceList = await Device.findAll({
        where: {
            isInRecycleBin: true,
            deviceName: {[Op.like]: '%' + keyword + '%'},
        }
    });
    if (DeviceList) {
        let result: DeviceModel[] = [];
        DeviceList.forEach((item) => {
            const {ID, manufacturerID, deviceName, createdAt, updatedAt, userInfoID} = item;
            result.push(new DeviceModel(ID, manufacturerID, deviceName, createdAt.getTime(), updatedAt.getTime(), userInfoID));
        });
        return new ResponseDB<DeviceModel[]>(true, 'searchDeletedDeviceInfoSuccess', result);
    } else {
        return new ResponseDB<DeviceModel[]>(true, 'searchDeletedDeviceInfoSuccess');
    }
}


export async function queryDeviceInfo(deviceID: number): Promise<ResponseDB<DeviceInfo>> {
    const device = await Device.findOne({
        where: {
            ID: deviceID,
        }
    });
    const dataList = await DeviceData.findAll({
        where: {
            deviceID: deviceID,
        }
    });
    if (device && dataList) {
        const {ID, manufacturerID, deviceName, createdAt, updatedAt, userInfoID} = device;
        let deviceModel: DeviceModel = new DeviceModel(ID, manufacturerID, deviceName, createdAt.getTime(), updatedAt.getTime(), userInfoID);
        let dataListModel: DeviceDataModel[] = [];
        dataList.forEach((item) => {
            const {data, categoryID} = item;
            dataListModel.push(new DeviceDataModel(data, categoryID));
        });
        const result: DeviceInfo = {device: deviceModel, deviceDataList: dataListModel}
        return new ResponseDB<{ device: DeviceModel; deviceDataList: DeviceDataModel[] }>(true, '', result);
    } else if (device && !dataList) {
        return new ResponseDB<{ device: DeviceModel; deviceDataList: DeviceDataModel[] }>(true, 'queryDeviceInfoSuccess')
    } else {
        return new ResponseDB<{ device: DeviceModel; deviceDataList: DeviceDataModel[] }>(false, 'DeviceNotFound');
    }

}

export async function queryDeviceAmount(): Promise<ResponseDB<number>> {
    const amount = await Device.count({
        where: {
            isInRecycleBin: false,
        }
    });
    return new ResponseDB<number>(true, 'amountQuerySuccess', amount);
}

export async function queryDeletedDeviceAmount(): Promise<ResponseDB<number>> {
    const amount = await Device.count({
        where: {
            isInRecycleBin: true,
        }
    });
    return new ResponseDB<number>(true, 'amountQuerySuccess', amount);
}

interface IPicture {
    picturePath: string;
    deviceID: number;
    device: Device;
}

export async function addDevicePicture(deviceID: number, picturesPath: string[]): Promise<ResponseDB<void>> {
    const t = await sequelize.transaction();
    let date = utilx.getTodayString();
    let dirPath = path.join(rootDirPath, 'files', filesDir, devicePicturesDir, date);
    try {
        await fse.ensureDir(dirPath);
        const device = await Device.findOne({
            where: {
                ID: deviceID,
            }
        });
        if (device) {//如果有设备
            const files: IPicture[] = [];
            let distPaths: string[] = [];
            for (let i = 0; i < picturesPath.length; i++) {
                distPaths.push(path.join(dirPath, utilx.getFileName(picturesPath[i])));
            }
            distPaths.forEach((item) => {
                let a: IPicture = {device: device, deviceID: deviceID, picturePath: item};
                files.push(a);
            });
            DevicePicture.bulkCreate(files);
            for (let i = 0; i < distPaths.length; i++) {
                await fse.move(picturesPath[i], distPaths[i]);
            }
            await t.commit();
            return new ResponseDB<void>(true, 'addPictureSuccess');
        } else {
            return new ResponseDB<void>(false, 'invalidDevice');
        }
    } catch (e) {
        await t.rollback();
        throw e;
    }
}

export async function addDeviceCoverPicture(deviceID: number, pictureID: number): Promise<ResponseDB<void>> {
    const t = await sequelize.transaction();
    try {
        const device = await Device.findOne({
            where: {
                ID: deviceID,
            }
        });
        if (device) {
            let OldCover = await DevicePicture.findOne({
                where: {
                    isCover: true,
                    deviceID: deviceID,
                }
            });
            if (OldCover) {
                OldCover.isCover = false;
                await OldCover.save();
            }
            let NewCover = await DevicePicture.findOne({
                where: {
                    ID: pictureID,
                    deviceID: deviceID,
                }
            });
            if (NewCover) {
                NewCover.isCover = true;
                await NewCover.save();
            } else {
                return new ResponseDB<void>(false, 'invalidPictureID');
            }
            if (NewCover.deviceID !== deviceID) {
                return new ResponseDB<void>(false, 'mismatching');
            }
            await t.commit();
            return new ResponseDB<void>(true, 'addDeviceCoverPictureSuccess');
        } else {
            return new ResponseDB<void>(false, 'invalidDeviceID');
        }
    } catch (e) {
        await t.rollback();
        throw e;
    }
}

export async function queryDeviceCoverPicture(deviceID: number): Promise<ResponseDB<string>> {
    const device = await Device.findOne({
        where: {
            ID: deviceID,
        }
    });
    if (device) {
        const cover = await DevicePicture.findOne({
            where: {
                deviceID: deviceID,
                isCover: true,
            }
        });
        if (cover) {
            const path = cover.picturePath;
            return new ResponseDB<string>(true, 'queryDeviceCoverPictureSuccess', path);
        } else {
            return new ResponseDB<string>(false, 'invalidPictureID');
        }
    } else {
        return new ResponseDB<string>(false, 'invalidDeviceID');
    }
}


export async function deleteDevicePicture(deviceID: number, pictureIDList: number[]): Promise<ResponseDB<void>> {
    const t = await sequelize.transaction();
    try {
        const device = await Device.findOne({
            where: {
                ID: deviceID,
                isInRecycleBin: false,
            }
        });
        if (device) {
            for (let i = 0; i < pictureIDList.length; i++) {
                const picture = await DevicePicture.findOne({
                    where: {
                        deviceID: deviceID,
                        ID: pictureIDList[i],
                    }
                });
                if (picture) {
                    await picture.destroy();
                } else {
                    return new ResponseDB<void>(false, 'pictureNotFound');
                }
            }
            await t.commit();
            return new ResponseDB<void>(true, 'pictureDeleted');
        } else {
            await t.rollback();
            return new ResponseDB<void>(false, 'deviceNotFound');
        }
    } catch (e) {
        await t.rollback();
        throw e;
    }
}

interface IDeviceFile {
    filePath: string;
    deviceID: number;
    device: Device;
}

export async function addDeviceAttachment(deviceID: number, deviceFiles: File[]): Promise<ResponseDB<void>> {
    const t = await sequelize.transaction();
    let date = utilx.getTodayString();
    let timeStamp = new Date().getTime();
    let dirPath = path.join(rootDirPath, 'files', filesDir, deviceAttachmentDir, date);
    try {
        await fse.ensureDir(dirPath);
        const device = await Device.findOne({
            where: {
                ID: deviceID,
            }
        });
        if (device) {
            const files: IDeviceFile[] = [];
            let distPaths: string[] = [];
            for (let i = 0; i < deviceFiles.length; i++) {
                distPaths.push(path.join(dirPath, timeStamp + "_" + deviceFiles[i].name));
            }
            for (let i = 0; i < distPaths.length; i++) {
                await fse.move(deviceFiles[i].path, distPaths[i]);
            }
            distPaths.forEach((item) => {
                let a: IDeviceFile = {filePath: item, deviceID: deviceID, device: device};
                files.push(a);
            });
            DeviceFile.bulkCreate(files);
            await t.commit();
            return new ResponseDB<void>(true, 'addAttachmentSuccess');
        } else {
            await t.rollback();
            return new ResponseDB<void>(false, 'invalidDevice');
        }
    } catch (e) {
        await t.rollback();
        throw e;
    }

}


export async function deleteDeviceAttachment(deviceID: number, fileIDList: number[]): Promise<ResponseDB<void>> {
    const t = await sequelize.transaction();
    try {
        const device = await Device.findOne({
            where: {
                ID: deviceID,
                isInRecycleBin: false,
            }
        });
        if (device) {
            for (let i = 0; i < fileIDList.length; i++) {
                const file = await DeviceFile.findOne({
                    where: {
                        deviceID: deviceID,
                        ID: fileIDList[i],
                    }
                });
                if (file) {
                    await file.destroy();
                } else {
                    return new ResponseDB<void>(false, 'attachmentNotFound');
                }
            }
            await t.commit();
            return new ResponseDB<void>(true, 'attachmentDeleted');
        } else {
            await t.rollback();
            return new ResponseDB<void>(false, 'deviceNotFound');
        }
    } catch (e) {
        await t.rollback();
        throw e;
    }
}

export async function addDeviceStereoPicture(deviceID: number, picturePaths: string[]): Promise<ResponseDB<void>> {
    const t = await sequelize.transaction();
    let date = utilx.getTodayString();
    let dirPath = path.join(rootDirPath, 'files', filesDir, devicePicturesDir, date);
    try {
        await fse.ensureDir(dirPath);

        const device = await Device.findOne({
            where: {
                ID: deviceID,
                isInRecycleBin: false,
            }
        });
        if (device) {
            const oldPictureList = await DevicePicture3D.findAll({
                where: {
                    deviceID: deviceID,
                }
            });
            if (oldPictureList) {//如果旧的3d图片存在就将其删除
                for (let i = 0; i < oldPictureList.length; i++) {
                    await oldPictureList[i].destroy();
                }
            }
            let newPictures: Picture3D[] = [];
            let distPaths: string[] = [];
            for (let i = 0; i < picturePaths.length; i++) {
                distPaths.push(path.join(dirPath, utilx.getFileName(picturePaths[i])));
            }
            for (let i = 0; i < distPaths.length; i++) {
                await fse.move(picturePaths[i], distPaths[i]);
            }
            distPaths.forEach((item) => {
                let a: Picture3D = {device: device, deviceID: deviceID, picturePath: item};
                newPictures.push(a);
            });
            await DevicePicture3D.bulkCreate(newPictures);
            return new ResponseDB<void>(true, 'addPicturesSuccess');
        } else {
            return new ResponseDB<void>(false, 'invalidDeviceID');
        }
    } catch (e) {
        await t.rollback();
        throw e;
    }
}

export async function queryDeviceStereoPicture(deviceID: number): Promise<ResponseDB<string[]>> {
    const device = await Device.findOne({
        where: {
            ID: deviceID,
        }
    });

    if (device) {
        const pictureList = await DevicePicture3D.findAll({
            where: {
                deviceID: deviceID,
            }
        });
        const result: string[] = [];
        if (pictureList) {
            pictureList.forEach((item) => {
                result.push(item.picturePath);
            });
        }
        return new ResponseDB<string[]>(true, 'query3DPictureSuccess', result);
    } else {
        return new ResponseDB<string[]>(false, 'invalidDeviceID');
    }
}

export async function deleteDeviceStereoPicture(deviceID: number): Promise<ResponseDB<void>> {
    const device = await Device.findOne({
        where: {
            ID: deviceID,
        }
    });
    if (device) {
        const pictureList = await DevicePicture3D.findAll({
            where: {
                deviceID: deviceID,
            }
        });
        if (pictureList) {
            for (let i = 0; i < pictureList.length; i++) {
                await pictureList[i].destroy();
            }
        }
        return new ResponseDB<void>(true, 'stereoPictureDeleted');
    } else {
        return new ResponseDB<void>(false, 'deviceNotFound');
    }
}

export async function queryDevicePicture(deviceID: number): Promise<ResponseDB<PictureInfo[]>> {
    const pictures = await DevicePicture.findAll({
        where: {
            deviceID: deviceID,
        }
    });
    let pictureInfo: PictureInfo[] = [];
    if (pictures) {
        pictures.forEach((item) => {
            const {ID, picturePath} = item;
            pictureInfo.push(new PictureInfo(picturePath, ID));
        });
        return new ResponseDB<PictureInfo[]>(true, "queryDevicePictureSuccess", pictureInfo);
    } else {
        return new ResponseDB<PictureInfo[]>(false, 'noPictures');
    }
}

export async function queryDeviceAmountOnID(userID: number) {
    const amount = await Device.count({
        where: {
            userInfoID: userID,
            isInRecycleBin: true,
        }
    });
    return new ResponseDB<number>(true, 'queryDeviceAmountOnIDSuccess', amount);
}

export async function queryDevice(deviceID: number): Promise<ResponseDB<DeviceModel>> {
    const device = await Device.findOne({
        where: {
            ID: deviceID,
        }
    });
    if (device) {
        const {ID, userInfoID, manufacturerID, createdAt, updatedAt, deviceName} = device;
        const result: DeviceModel = new DeviceModel(ID, manufacturerID, deviceName, createdAt.getTime(), updatedAt.getTime(), userInfoID);
        return new ResponseDB<DeviceModel>(true, 'queryDeviceSuccess', result);
    } else {
        return new ResponseDB<DeviceModel>(false, 'queryFailed');
    }
}

export async function queryDeviceAttachment(deviceID: number): Promise<ResponseDB<AttachmentInfo[]>> {
    const device = await Device.findOne({
        where: {
            ID: deviceID,
            isInRecycleBin: false,
        }
    });
    if (device) {
        const attachmentList = await DeviceFile.findAll({
            where: {
                deviceID: deviceID,
            }
        });
        if (attachmentList) {
            let result: AttachmentInfo[] = [];
            attachmentList.forEach((item) => {
                const {ID, filePath, deviceID} = item;
                let ext = filePath.split('\\');
                const fileName = ext[ext.length - 1];
                result.push(new AttachmentInfo(fileName, filePath, ID, deviceID));
            });
            return new ResponseDB<AttachmentInfo[]>(true, 'attachmentQuerySuccess', result);
        } else {
            let result: AttachmentInfo[] = [];
            return new ResponseDB<AttachmentInfo[]>(true, 'attachmentQuerySuccess', result);
        }
    } else {
        return new ResponseDB<AttachmentInfo[]>(false, 'invalidDevice');
    }
}


export async function deleteDeviceData(deviceID: number, categoryID: number): Promise<ResponseDB<void>> {
    const t = await sequelize.transaction();
    try {
        const device = await Device.findOne({
            where: {
                ID: deviceID,
                isInRecycleBin: false,
            }
        });
        if (device) {
            const data = await DeviceData.findOne({
                where: {
                    deviceID: deviceID,
                    categoryID: categoryID,
                }
            });
            if (data) {
                await data.destroy();
                await t.commit();
                return new ResponseDB<void>(true, 'deleteSuccess');
            } else {
                await t.commit();
                return new ResponseDB<void>(false, 'noSuchData');
            }
        } else {
            await t.commit();
            return new ResponseDB<void>(false, 'invalidDevice');
        }
    } catch (e) {
        await t.rollback();
        throw e;
    }
}