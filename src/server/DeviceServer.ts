import {DeviceData} from "../Class/DeviceData";
import {ResponseServer} from "../instances/responseServer";
import {Device} from "../Class/Device";
import {File} from "formidable";
import {maxFileSize} from "../instances/maxFileSize";
import {IDevice} from "../Class/IDevice";
import fse from "fs-extra";
import {
    addDevice as addDeviceDB,
    addDeviceAttachment as addDeviceAttachmentDB,
    addDeviceCoverPicture as addDeviceCoverPictureDB,
    addDevicePicture as addDevicePictureDB,
    addDeviceStereoPicture as addDeviceStereoPictureDB,
    deletedDeviceRecover as deletedDeviceRecoverDB,
    deleteDevice as deleteDeviceDB,
    deleteDeviceAttachment as deleteDeviceAttachmentDB,
    deleteDeviceData as deleteDeviceDataDB,
    deleteDevicePicture as deleteDevicePictureDB,
    deleteDeviceStereoPicture as deleteDeviceStereoPictureDB,
    listDeletedDevice as listDeletedDeviceDB,
    listDevice as listDeviceDB,
    listDeviceOnID as listDeviceOnIDDB,
    modifyDevice,
    queryDeletedDeviceAmount as queryDeletedDeviceAmountDB,
    queryDevice as queryDeviceDB,
    queryDeviceAmount as queryDeviceAmountDB,
    queryDeviceAmountOnID as queryDeviceAmountOnIDDB,
    queryDeviceAttachment as queryDeviceAttachmentDB,
    queryDeviceCoverPicture as queryDeviceCoverPictureDB,
    queryDeviceInfo as queryDeviceInfoDB,
    queryDevicePicture as queryDevicePictureDB,
    queryDeviceStereoPicture as queryDeviceStereoPictureDB,
    searchDeletedDevice as searchDeletedDeviceDB,
    searchDevice as searchDeviceDB,
    destroyDevice as destroyDeviceDB,
} from "../database/DeviceDatabase";
import {checkDvSupSession, checkSupervisorSession} from "./checkPermission";
import {permissionDeny} from "./permissionDeny";
import {UserType} from "../Enum/UserType";
import {ResponseDB} from "../instances/ResponseDB";
import {queryUserInfo as queryUserInfoDB} from "../database/UserSupervisorDatabase";
import {DeviceInfo} from "../interface/DeviceInfo";
import {utilx} from "../instances/utilx";
import {PictureInfo} from "../Class/PictureInfo";
import {AttachmentInfo} from "../Class/AttachmentInfo";
import is_number from "is-number";


export async function supervisorAddDevice(deviceName: string, manufacturerID: number, sessionUserID: number, deviceAdminID?: number, deviceDataList?: DeviceData[]): Promise<ResponseServer<number>> {
    const res = await checkSupervisorSession(sessionUserID);
    if (res.body.data && res.body.isSuccessful) {//是超管
        if (deviceAdminID) {
            if (deviceDataList) {
                const response = await addDeviceDB(deviceName, manufacturerID, deviceAdminID, deviceDataList);
                return new ResponseServer<number>(response);
            } else {
                const response = await addDeviceDB(deviceName, manufacturerID, deviceAdminID);
                return new ResponseServer<number>(response);
            }
        } else {//没有deviceAdminID 即是超管添加
            if (deviceDataList) {
                const response = await addDeviceDB(deviceName, manufacturerID, sessionUserID, deviceDataList);
                return new ResponseServer<number>(response);
            } else {
                const response = await addDeviceDB(deviceName, manufacturerID, sessionUserID);
                return new ResponseServer<number>(response);
            }
        }
    } else {//不是超管
        return permissionDeny<number>();
    }
}

export async function deviceAdminAddDevice(deviceName: string, manufacturerID: number, sessionUserID: number, deviceDataList?: DeviceData[],): Promise<ResponseServer<number>> {
    const res = await checkDvSupSession(sessionUserID);
    if (res.body.isSuccessful && res.body.data) {
        if (deviceDataList) {
            const response = await addDeviceDB(deviceName, manufacturerID, sessionUserID, deviceDataList);
            return new ResponseServer<number>(response);
        } else {
            const response = await addDeviceDB(deviceName, manufacturerID, sessionUserID);
            return new ResponseServer<number>(response);
        }
    } else {
        return permissionDeny();
    }
}

export async function supervisorModifyDevice(deviceID: number, sessionUserID: number, newDeviceName?: string, newManufacturerID?: number, newDeviceDataList?: DeviceData[], newDeviceAdminID?: number): Promise<ResponseServer<void>> {
    const res = await checkSupervisorSession(sessionUserID);
    if (res.body.isSuccessful && res.body.data) {
        let newDevice = JSON.parse(JSON.stringify(new IDevice(deviceID, newDeviceName, newManufacturerID, newDeviceDataList, newDeviceAdminID)));
        const device = await queryDeviceInfo(deviceID)
        if (device.body.isSuccessful && device.body.data) {
            const oldDevice = device.body.data.device;
            const result = Object.assign(oldDevice, newDevice);
            if (newDeviceDataList) {
                const {deviceID, deviceName, manufacturerID, userID} = result;
                const response = await modifyDevice(deviceID, deviceName, manufacturerID, newDeviceDataList, userID);
                return new ResponseServer<void>(response);
            } else {
                const {deviceID, deviceName, manufacturerID, userID} = result;
                const response = await modifyDevice(deviceID, deviceName, manufacturerID, device.body.data.deviceDataList, userID);
                return new ResponseServer<void>(response);
            }
        } else {
            return new ResponseServer<void>(
                new ResponseDB<void>(false, 'invalidDevice')
            );
        }
    } else {
        return permissionDeny<void>();
    }
}

export async function deviceAdminModifyDevice(deviceID: number, sessionUserID: number, newDeviceName?: string, newManufacturerID?: number, newDeviceDataList?: DeviceData[]): Promise<ResponseServer<void>> {
    const res = await checkDvSupSession(sessionUserID);
    if (res.body.isSuccessful) {
        let newDevice = JSON.parse(JSON.stringify(new IDevice(deviceID, newDeviceName, newManufacturerID, newDeviceDataList, sessionUserID)));
        const device = await queryDeviceInfo(deviceID)
        if (device.body.isSuccessful && device.body.data) {
            const oldDevice = device.body.data.device;
            const result = Object.assign(oldDevice, newDevice);
            if (newDeviceDataList) {
                const {deviceID, deviceName, manufacturerID, userID} = result;
                const response = await modifyDevice(deviceID, deviceName, manufacturerID, newDeviceDataList, userID);
                return new ResponseServer<void>(response);
            } else {
                const {deviceID, deviceName, manufacturerID, userID} = result;
                const response = await modifyDevice(deviceID, deviceName, manufacturerID, device.body.data.deviceDataList, userID);
                return new ResponseServer<void>(response);
            }
        } else {
            return new ResponseServer<void>(
                new ResponseDB<void>(false, 'invalidDevice')
            );
        }
    } else {
        return permissionDeny<void>();
    }
}

export async function deleteDevice(deviceID: number, sessionUserID: number): Promise<ResponseServer<void>> {
    const res = await checkDvSupSession(sessionUserID);
    if (res.body.isSuccessful && res.body.data) {
        if (res.body.data.userType === UserType.SUPERVISOR) {
            const responseDB = await deleteDeviceDB(deviceID);
            return new ResponseServer<void>(responseDB);
        } else if (res.body.data.userType === UserType.DEVICEADMIN) {
            const device = await queryDeviceDB(deviceID);
            if (device.data && device.isSuccessful) {
                if (device.data.userID !== sessionUserID) {//设备所属人是本人
                    const responseDB = await deleteDeviceDB(deviceID);
                    return new ResponseServer<void>(responseDB);
                } else {
                    return permissionDeny<void>();
                }
            } else {
                return new ResponseServer<void>(
                    new ResponseDB(false, 'invalidDevice')
                )
            }
        } else {
            return permissionDeny<void>();
        }
    } else {
        return permissionDeny<void>();
    }
}

export async function deletedDeviceRecover(deviceID: number, sessionUserID: number): Promise<ResponseServer<void>> {
    const res = await checkSupervisorSession(sessionUserID);
    if (res.body.isSuccessful) {
        const response = await deletedDeviceRecoverDB(deviceID);
        return new ResponseServer<void>(response);
    } else {
        return permissionDeny<void>();
    }
}

export async function listDevice(offset: number, limit: number): Promise<ResponseServer<Device[]>> {
    const response = await listDeviceDB(offset, limit);
    return new ResponseServer<Device[]>(response);
}

export async function listDeletedDevice(offset: number, limit: number, sessionUserID: number): Promise<ResponseServer<Device[]>> {
    const res = await checkSupervisorSession(sessionUserID);
    if (res.body.isSuccessful) {//是超管
        const response = await listDeletedDeviceDB(offset, limit);
        return new ResponseServer<Device[]>(response);
    } else {
        return permissionDeny<Device[]>();
    }
}

export async function searchDevice(keyword?: string, deviceDataList?: DeviceData[]): Promise<ResponseServer<Device[]>> {
    if (keyword && keyword === '') {
        return new ResponseServer<Device[]>(
            new ResponseDB(false, 'invalidParameter')
        );
    }
    const response = await searchDeviceDB(keyword, deviceDataList);
    return new ResponseServer<Device[]>(response);
}

export async function searchDeletedDevice(keyword: string, sessionUserID: number): Promise<ResponseServer<Device[]>> {
    if (keyword === '') {
        return new ResponseServer<Device[]>(
            new ResponseDB(false, 'invalidParameter')
        );
    }
    const res = await checkSupervisorSession(sessionUserID);
    if (res.body.isSuccessful) {
        const response = await searchDeletedDeviceDB(keyword);
        return new ResponseServer<Device[]>(response);
    } else {
        return permissionDeny<Device[]>();
    }
}

export async function queryDeviceInfo(deviceID: number): Promise<ResponseServer<DeviceInfo>> {
    const response = await queryDeviceInfoDB(deviceID);
    return new ResponseServer<DeviceInfo>(response);
}

export async function queryDeviceAmount(): Promise<ResponseServer<number>> {
    const response = await queryDeviceAmountDB();
    return new ResponseServer<number>(response);
}

export async function checkDevicePicture(deviceID: number, sessionUserID: number): Promise<ResponseServer<void>> {
    const res = await checkDvSupSession(sessionUserID);
    if (res.body.isSuccessful) {
        const device = await queryDeviceDB(deviceID);
        if (device) {
            return new ResponseServer<void>(
                new ResponseDB(true, 'checkDevicePictureSuccess')
            );
        } else {
            return new ResponseServer<void>(
                new ResponseDB(false, 'invalidDeviceID')
            );
        }
    } else {
        return permissionDeny<void>();
    }
}

export async function addDevicePicture(deviceID: number, files: File[], sessionUserID: number): Promise<ResponseServer<void>> {
    const res = await checkDvSupSession(sessionUserID);
    const f: File[] = [];
    if (Array.isArray(files)) {//判断files是不是数组
        for (let i = 0; i < files.length; i++) {
            f.push(files[i]);
        }
    } else {//不是数组
        f.push(files);
    } //为了兼容单文件和多文件 将单文件也转换为数组 这样使用f进行文件的操作
    let flag = true;
    f.forEach((item) => {
        if (!utilx.checkPicture(item)) {
            flag = false;
        }
    })
    if (!flag) {
        for (let i = 0; i < f.length; i++) {
            await fse.remove(f[i].path);
        }
        return new ResponseServer<void>(
            new ResponseDB<void>(false, 'invalidPicture')
        )
    }
    const filePath: string[] = [];
    for (let i = 0; i < f.length; i++) {
        //let dist:string = path.join(dirPath , f[i].name);
        //await fse.move(f[i].path,dist);
        filePath.push(f[i].path);
    }
    if (res.body.isSuccessful) {
        const response = await addDevicePictureDB(deviceID, filePath);
        return new ResponseServer<void>(response);
    } else {
        return permissionDeny<void>();
    }
}

export async function selectDeviceCover(deviceID: number, pictureID: number, sessionUserID: number): Promise<ResponseServer<void>> {
    const res = await checkDvSupSession(sessionUserID);
    if (res.body.isSuccessful) {
        const response = await addDeviceCoverPictureDB(deviceID, pictureID);
        return new ResponseServer<void>(response);
    } else {
        return permissionDeny<void>();
    }
}

export async function queryDeviceCover(deviceID: number): Promise<ResponseServer<string>> {
    const response = await queryDeviceCoverPictureDB(deviceID);
    return new ResponseServer<string>(response);
}

export async function checkDeviceAttachment(deviceID: number, sessionUserID: number, fileSizes: number[]): Promise<ResponseServer<void>> {
    const res = await checkDvSupSession(sessionUserID);
    if (res.body.isSuccessful) {
        const device = await queryDeviceDB(deviceID);
        if (device) {

            // for (let i = 0; i < fileNames.length; i++) {
            //     if (!utilx.checkAttachmentString(fileNames[i])) {
            //         return new ResponseServer<void>(
            //             new ResponseDB<void>(false, 'invalidFileType')
            //         );
            //     }
            // }
            let sum:number = 0;
            for (let i = 0; i < fileSizes.length; i++) {
                sum += fileSizes[i];
            }
            if (sum > maxFileSize) {
                return new ResponseServer<void>(
                    new ResponseDB<void>(false, 'invalidFileSize')
                );
            }
            //还可以检查一下数量合不合法，但是现在还没检查：数量任意
            return new ResponseServer<void>(
                new ResponseDB(true, 'checkDevicePictureSuccess')
            );
        } else {
            return new ResponseServer<void>(
                new ResponseDB(false, 'invalidDeviceID')
            );
        }
    } else {
        return permissionDeny<void>();
    }
}

export async function addDeviceAttachment(deviceID: number, files: File, sessionUserID: number): Promise<ResponseServer<void>> {
    const res = await checkDvSupSession(sessionUserID);
    const f: File[] = [];
    if (Array.isArray(files)) {//判断files是不是数组
        for (let i = 0; i < files.length; i++) {
            f.push(files[i]);
        }
    } else {//不是数组
        f.push(files);
    } //为了兼容单文件和多文件 将单文件也转换为数组 这样使用f进行文件的操作
    if (res.body.isSuccessful && res.body.data) {
        if (res.body.data.userType === UserType.SUPERVISOR) {
            const response = await addDeviceAttachmentDB(deviceID, f);
            return new ResponseServer<void>(response);
        } else {
            const device = await queryDeviceDB(deviceID);
            if (device.data) {
                if (device.data.userID !== sessionUserID) {
                    return permissionDeny<void>();
                } else {
                    const response = await addDeviceAttachmentDB(deviceID, f);
                    return new ResponseServer<void>(response);
                }
            } else {
                for (let i = 0; i < f.length; i++) {
                    await fse.remove(f[i].path);
                }
                return new ResponseServer<void>(
                    new ResponseDB(false, 'invalidDevice')
                );
            }
        }
    } else {
        return permissionDeny<void>();
    }
}

export async function deleteDevicePicture(deviceID: number, pictureID: number[], sessionUserID: number): Promise<ResponseServer<void>> {
    const res = await checkDvSupSession(sessionUserID);
    if (res.body.isSuccessful && res.body.data) {
        const user = res.body.data;
        if (user.userType === UserType.DEVICEADMIN) {
            const device = await queryDeviceDB(deviceID);
            if (device.isSuccessful && device.data) {
                if (device.data.userID !== sessionUserID) {
                    return permissionDeny<void>();
                } else {
                    const response = await deleteDevicePictureDB(deviceID, pictureID);
                    return new ResponseServer<void>(response);
                }
            } else {
                return new ResponseServer<void>(
                    new ResponseDB(false, 'invalidDeviceID')
                );
            }
        } else if (user.userType === UserType.SUPERVISOR) {
            const response = await deleteDevicePictureDB(deviceID, pictureID);
            return new ResponseServer<void>(response);
        } else {
            return permissionDeny<void>();
        }
    } else {
        return permissionDeny<void>();
    }
}

export async function deleteDeviceAttachment(deviceID: number, fileID: number[], sessionUserID: number): Promise<ResponseServer<void>> {
    const res = await checkDvSupSession(sessionUserID);
    if (res.body.isSuccessful && res.body.data) {
        const user = res.body.data;
        if (user.userType === UserType.DEVICEADMIN) {
            const device = await queryDeviceDB(deviceID);
            if (device.isSuccessful && device.data) {
                if (device.data.userID !== sessionUserID) {
                    return permissionDeny<void>();
                } else {
                    const response = await deleteDeviceAttachmentDB(deviceID, fileID);
                    return new ResponseServer<void>(response);
                }
            } else {
                return new ResponseServer<void>(
                    new ResponseDB(false, 'invalidDeviceID')
                );
            }
        } else if (user.userType === UserType.SUPERVISOR) {
            const response = await deleteDeviceAttachmentDB(deviceID, fileID);
            return new ResponseServer<void>(response);
        } else {
            return permissionDeny<void>();
        }
    } else {
        return permissionDeny<void>();
    }
}

export async function addDeviceStereoPicture(deviceID: number, files: File[], sessionUserID: number): Promise<ResponseServer<void>> {
    const res = await checkDvSupSession(sessionUserID);
    const f: File[] = [];
    if (Array.isArray(files)) {//判断files是不是数组
        for (let i = 0; i < files.length; i++) {
            f.push(files[i]);
        }
    } else {//不是数组
        f.push(files);
    } //为了兼容单文件和多文件 将单文件也转换为数组 这样使用f进行文件的操作
    let flag = true;
    f.forEach((item) => {
        if (!utilx.checkPicture(item)) {
            flag = false;
        }
    })
    if (!flag) {
        for (let i = 0; i < f.length; i++) {
            await fse.remove(f[i].path);
        }
        return new ResponseServer<void>(
            new ResponseDB<void>(false, 'invalidPicture')
        )
    }
    const picturePath: string[] = [];
    for (let i = 0; i < f.length; i++) {
        //let dist:string = path.join(dirPath , f[i].name);
        //await fse.move(f[i].path,dist);
        picturePath.push(f[i].path);
    }
    if (res.body.isSuccessful && res.body.data) {
        if (res.body.data.userType === UserType.DEVICEADMIN) {
            const device = await queryDeviceDB(deviceID);
            if (device.data && device.isSuccessful) {
                if (device.data.userID === sessionUserID) {
                    const response = await addDeviceStereoPictureDB(deviceID, picturePath);
                    return new ResponseServer<void>(response);
                } else {
                    return permissionDeny<void>();
                }
            } else {
                return new ResponseServer<void>(
                    new ResponseDB(false, 'invalidDevice')
                );
            }
        } else if (res.body.data.userType === UserType.SUPERVISOR) {
            const response = await addDeviceStereoPictureDB(deviceID, picturePath);
            return new ResponseServer<void>(response);
        } else {
            return permissionDeny<void>();
        }
    } else {
        return permissionDeny<void>();
    }
}


export async function queryUpdateStatus(deviceID: number, sessionUserID: number): Promise<ResponseServer<number>> {
    console.log(deviceID);
    console.log(sessionUserID);
    return new ResponseServer<number>(
        new ResponseDB(true, '')
    );
}

export async function queryDeviceStereoPicture(deviceID: number): Promise<ResponseServer<string[]>> {
    const response = await queryDeviceStereoPictureDB(deviceID);
    return new ResponseServer<string[]>(response);
}

export async function deletedDeviceStereoPicture(deviceID: number, sessionUserID: number): Promise<ResponseServer<void>> {
    const res = await checkDvSupSession(sessionUserID);
    if (res.body.data && res.body.isSuccessful) {
        if (res.body.data.userType === UserType.DEVICEADMIN) {
            const device = await queryDeviceDB(deviceID);
            if (device.data && device.isSuccessful) {
                if (device.data.userID !== sessionUserID) {
                    return permissionDeny<void>();
                } else {
                    const response = await deleteDeviceStereoPictureDB(deviceID);
                    return new ResponseServer<void>(response);
                }
            } else {
                return new ResponseServer<void>(
                    new ResponseDB(false, 'invalidDevice')
                );
            }
        } else if (res.body.data.userType === UserType.SUPERVISOR) {
            const response = await deleteDeviceStereoPictureDB(deviceID);
            return new ResponseServer<void>(response);
        } else {
            return permissionDeny<void>();
        }
    } else {
        return permissionDeny<void>();
    }
}


export async function queryDevicePictures(deviceID: number): Promise<ResponseServer<PictureInfo[]>> {
    const response = await queryDevicePictureDB(deviceID);
    return new ResponseServer<PictureInfo[]>(response);
}

export async function listDeviceOnID(offset: number, limit: number, userID: number, sessionUserID: number): Promise<ResponseServer<Device[]>> {
    const res = await checkDvSupSession(sessionUserID);
    if (res.body.data && res.body.isSuccessful) {
        if (res.body.data.userType === UserType.SUPERVISOR) {//是超管
            const user = await queryUserInfoDB(userID);
            if (user.isSuccessful && user.data) {
                const response = await listDeviceOnIDDB(offset, limit, userID);
                return new ResponseServer(response);
            } else {
                return new ResponseServer(
                    new ResponseDB(false, 'invalidUser')
                );
            }
        } else if (res.body.data.userType === UserType.DEVICEADMIN) {
            const response = await listDeviceOnIDDB(offset, limit, sessionUserID);
            return new ResponseServer(response);
        } else {
            return permissionDeny<Device[]>();
        }
    } else {
        return permissionDeny<Device[]>();
    }
}

export async function queryDeviceAmountOnID(sessionUserID: number): Promise<ResponseServer<number>> {
    const res = await checkDvSupSession(sessionUserID);
    if (res.body.data && res.body.isSuccessful) {
        const response = await queryDeviceAmountOnIDDB(sessionUserID);
        return new ResponseServer<number>(response);
    } else {
        return permissionDeny<number>();
    }
}

export async function queryDeletedDeviceAmount(sessionUserID: number) {
    const res = await checkSupervisorSession(sessionUserID);
    if (res.body.data && res.body.isSuccessful) {
        const response = await queryDeletedDeviceAmountDB();
        return new ResponseServer(response);
    } else {
        return permissionDeny<number>();
    }
}

export async function queryDeviceAttachment(deviceID: number): Promise<ResponseServer<AttachmentInfo[]>> {
    const response = await queryDeviceAttachmentDB(deviceID);
    return new ResponseServer<AttachmentInfo[]>(response);
}

export async function deleteDeviceData(deviceID: number, dataCategoryID: number, sessionUserID: number): Promise<ResponseServer<void>> {
    const res = await checkDvSupSession(sessionUserID);
    if (res.body.isSuccessful && res.body.data) {
        if (res.body.data.userType === UserType.SUPERVISOR) { //是超管 随便删除
            const response = await deleteDeviceDataDB(deviceID, dataCategoryID);
            return new ResponseServer<void>(response);
        } else { //是deviceAdmin
            const device = await queryDeviceDB(deviceID);
            if (device.data && device.isSuccessful) {
                if (device.data.userID === sessionUserID) { //是自己的设备
                    const response = await deleteDeviceDataDB(deviceID, dataCategoryID);
                    return new ResponseServer<void>(response);
                } else { //不是自己的设备
                    return permissionDeny<void>();
                }
            } else { //没有该设备
                return new ResponseServer<void>(
                    new ResponseDB<void>(false, 'invalidDevice')
                );
            }
        }
    } else {
        return permissionDeny();
    }
}

export async function checkDeviceStereoPicture(deviceID: number, fileNames: string[], fileSizes: number[], sessionUserID: number) {
    const res = await checkDvSupSession(sessionUserID);
    if (res.body.isSuccessful && res.body.data) {
        const device = await queryDeviceDB(deviceID);
        if (device) {
            let flag :boolean = true;
            fileNames.forEach((item) => {
                let ext = item.split('.');
                let trueName = ext[0];//获得真实名字：排除后缀名
                if(!is_number(trueName)){
                    flag = false;
                }
            });
            if(!flag){
                return new ResponseServer(
                    new ResponseDB(false,'invalidPictureName')
                );
            }
            let sum:number = 0;
            fileSizes.forEach((item)=>{
                sum +=item;
            })
            if(sum>maxFileSize){
                return new ResponseServer(
                    new ResponseDB(false,'invalidFileSize')
                );
            }
            return new ResponseServer<void>(
                new ResponseDB<void>(true, 'checkDeviceStereoPictureSuccess')
            );
        } else {
            return new ResponseServer<void>(
                new ResponseDB<void>(false, 'invalidDevice')
            )
        }
    } else {
        return permissionDeny();
    }
}

export async function destroyDevice(deviceID:number,sessionUserID:number){
    const res = await checkDvSupSession(sessionUserID);
    if(res.body.isSuccessful && res.body.data){
        const response = await destroyDeviceDB(deviceID);
        return new ResponseServer<void>(response);
    } else {
        return permissionDeny<void>();
    }
}