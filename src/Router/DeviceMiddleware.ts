import Router from "koa-router";
import {checkDvSupSession, checkSupervisorSession} from "./VerificationMiddleware/CheckPermissionMiddleware";
import {invalidParameter} from "./MiddlewareExceptionFuc/invalidParameter";
import {checkType} from "../Instances/CheckType";
import is_number from "is-number";
import {
    supervisorAddDevice,
    deviceAdminAddDevice,
    supervisorModifyDevice,
    deviceAdminModifyDevice,
    deleteDevice,
    deletedDeviceRecover,
    listDevice,
    listDeletedDevice,
    searchDevice,
    searchDeletedDevice,
    queryDeviceInfo,
    queryDeviceAmount,
    checkDevicePicture,
    addDevicePicture,
    selectDeviceCover,
    queryDeviceCover,
    checkDeviceAttachment,
    addDeviceAttachment,
    deleteDevicePicture,
    deleteDeviceAttachment,
    addDeviceStereoPicture,
    queryDeviceStereoPicture,
    deletedDeviceStereoPicture,
    queryUpdateStatus,
    queryDevicePictures,
    listDeviceOnID,
    queryDeviceAmountOnID,
    queryDeletedDeviceAmount,
    queryDeviceAttachment,
    deleteDeviceData,
    checkDeviceStereoPicture,
    destroyDevice,
    searchDeviceOnID
} from "../Server/DeviceServer";
import {ResponseBody} from "../Instances/ResponseBody";
import {Device} from "../Class/Device";
import {utilx} from "../Instances/Utilx";
import {DeviceInfo} from "../Interface/DeviceInfo";
import {IContext,  IState} from "../Interface/Session";
import {PictureInfo} from "../Class/PictureInfo";
import {AttachmentInfo} from "../Class/AttachmentInfo";


module.exports = (router: Router<IState, IContext>) => {
    router.post('/api/supervisorAddDevice', checkSupervisorSession, async (ctx) => {
        if (typeof ctx.request.body.deviceName !== 'string' || typeof ctx.request.body.manufacturerID !== 'number' || (typeof ctx.request.body.deviceAdminID !== 'number' && typeof ctx.request.body.deviceAdminID !== 'undefined') || (!checkType.instanceOfDeviceDataList(ctx.request.body.deviceDataList) && typeof ctx.request.body.deviceDataList !== 'undefined')) {
            ctx.body = invalidParameter();
        } else {
            const {deviceName, manufacturerID, deviceDataList, deviceAdminID} = ctx.request.body;
            const {userID} = ctx.session!.data!;
            const response = await supervisorAddDevice(deviceName, manufacturerID, userID, deviceAdminID, deviceDataList);
            if (response.body.data && response.body.isSuccessful) {
                const {isSuccessful, message, data} = response.body;
                ctx.body = new ResponseBody<number>(isSuccessful, message, data);
            } else {
                const {isSuccessful, message} = response.body;
                ctx.body = new ResponseBody<number>(isSuccessful, message);
            }
        }
    });

    router.post('/api/deviceAdminAddDevice', checkDvSupSession, async (ctx) => {
        if (typeof ctx.request.body.deviceName !== 'string' || typeof ctx.request.body.manufacturerID !== 'number' || !checkType.instanceOfDeviceDataList(ctx.request.body.deviceDataList)) {
            ctx.body = invalidParameter();
        } else {
            const {deviceName, manufacturerID, deviceDataList} = ctx.request.body;
            const {userID} = ctx.session!.data!;
            const response = await deviceAdminAddDevice(deviceName, manufacturerID, userID, deviceDataList);
            if (response.body.data && response.body.isSuccessful) {
                const {isSuccessful, message, data} = response.body;
                ctx.body = new ResponseBody<number>(isSuccessful, message, data);
            } else {
                const {isSuccessful, message} = response.body;
                ctx.body = new ResponseBody<number>(isSuccessful, message);
            }
        }
    });

    router.post('/api/supervisorModifyDevice', checkSupervisorSession, async (ctx) => {
        if (typeof ctx.request.body.deviceID !== 'number' || (typeof ctx.request.body.deviceName !== 'string' && typeof ctx.request.body.deviceName !== 'undefined') || (typeof ctx.request.body.manufacturerID !== 'number' && typeof ctx.request.body.manufacturerID !== 'undefined') || (!checkType.instanceOfDeviceDataList(ctx.request.body.deviceDataList) && ctx.request.body.deviceDataList !== undefined) || (typeof ctx.request.body.deviceAdminID !== "number" && typeof ctx.request.body.deviceAdminID !== 'undefined')) {
            ctx.body = invalidParameter();
        } else {
            const {deviceID, deviceName, manufacturerID, deviceDataList, deviceAdminID} = ctx.request.body;
            const {userID} = ctx.session!.data!;
            const response = await supervisorModifyDevice(deviceID, userID, deviceName, manufacturerID, deviceDataList, deviceAdminID);
            const {isSuccessful, message} = response.body;
            ctx.body = new ResponseBody<void>(isSuccessful, message);
        }
    });

    router.post('/api/deviceAdminModifyDevice', checkDvSupSession, async (ctx) => {
        if (typeof ctx.request.body.deviceID !== 'number' || (typeof ctx.request.body.deviceName !== 'string' && typeof ctx.request.body.deviceName !== 'undefined') || (typeof ctx.request.body.manufacturerID !== 'number' && typeof ctx.request.body.manufacturerID !== 'undefined') || (!checkType.instanceOfDeviceDataList(ctx.request.body.deviceDataList) && ctx.request.body.deviceDataList !== undefined)) {
            ctx.body = invalidParameter();
        } else {
            const {deviceID, deviceName, manufacturerID, deviceDataList} = ctx.request.body;
            const {userID} = ctx.session!.data!;
            const response = await deviceAdminModifyDevice(deviceID, userID, deviceName, manufacturerID, deviceDataList);
            const {isSuccessful, message} = response.body;
            ctx.body = new ResponseBody<void>(isSuccessful, message);
        }
    });

    router.post('/api/deleteDevice', checkDvSupSession, async (ctx) => {
        if (typeof ctx.request.body.deviceID !== 'number') {
            ctx.body = invalidParameter();
        } else {
            const {deviceID} = ctx.request.body;
            const {userID} = ctx.session!.data!;
            const response = await deleteDevice(deviceID, userID);
            const {isSuccessful, message} = response.body;
            ctx.body = new ResponseBody<void>(isSuccessful, message);
        }
    });

    router.post('/api/deletedDeviceRecover', checkSupervisorSession, async (ctx) => {
        if (typeof ctx.request.body.deviceID !== 'number') {
            ctx.body = invalidParameter();
        } else {
            const {deviceID} = ctx.request.body;
            const {userID} = ctx.session!.data!;
            const response = await deletedDeviceRecover(deviceID, userID);
            const {isSuccessful, message} = response.body;
            ctx.body = new ResponseBody(isSuccessful, message);
        }
    });

    router.get('/api/listDevice', async (ctx) => {
        if (!is_number(ctx.request.query.offset) || !is_number(ctx.request.query.limit)) {
            ctx.body = invalidParameter();
        } else {
            let {offset, limit} = ctx.request.query;
            offset = Number(offset);
            limit = Number(limit);
            const response = await listDevice(offset, limit);
            if (response.body.isSuccessful && response.body.data) {
                const {isSuccessful, message, data} = response.body;
                ctx.body = new ResponseBody<Device[]>(isSuccessful, message, data);
            } else {
                const {isSuccessful, message} = response.body;
                ctx.body = new ResponseBody<Device[]>(isSuccessful, message);
            }
        }
    });

    router.get('/api/listDeletedDevice', checkSupervisorSession, async (ctx) => {
        if (!is_number(ctx.request.query.offset) || !is_number(ctx.request.query.limit)) {
            ctx.body = invalidParameter();
        } else {
            let {offset, limit} = ctx.request.query;
            offset = Number(offset);
            limit = Number(limit);
            const {userID} = ctx.session!.data!;
            const response = await listDeletedDevice(offset, limit, userID);
            if (response.body.isSuccessful && response.body.data) {
                const {isSuccessful, message, data} = response.body;
                ctx.body = new ResponseBody<Device[]>(isSuccessful, message, data);
            } else {
                const {isSuccessful, message} = response.body;
                ctx.body = new ResponseBody<Device[]>(isSuccessful, message);
            }
        }
    });

    router.get('/api/searchDevice', async (ctx) => {
        if ((typeof ctx.request.query.keyword !== 'string' && typeof ctx.request.query.keyword !== 'undefined') || (!checkType.instanceOfDeviceDataList(ctx.request.query.deviceDataList) && ctx.request.query.deviceDataList !== undefined)) {
            ctx.body = invalidParameter();
        } else {
            let {keyword, deviceDataList} = ctx.request.query;
            const response = await searchDevice(keyword, deviceDataList);
            if (response.body.data && response.body.isSuccessful) {
                const {isSuccessful, message, data} = response.body;
                ctx.body = new ResponseBody<Device[]>(isSuccessful, message, data);
            } else {
                const {isSuccessful, message} = response.body;
                ctx.body = new ResponseBody<Device[]>(isSuccessful, message);
            }
        }
    });

    router.get('/api/searchDeletedDevice', async (ctx) => {
        if ((typeof ctx.request.query.keyword !== 'string' && typeof ctx.request.query.keyword !== 'undefined')) {
            ctx.body = invalidParameter();
        } else {
            let {keyword} = ctx.request.query;
            const {userID} = ctx.session!.data!;
            const response = await searchDeletedDevice(keyword, userID);
            if (response.body.data && response.body.isSuccessful) {
                const {isSuccessful, message, data} = response.body;
                ctx.body = new ResponseBody<Device[]>(isSuccessful, message, data);
            } else {
                const {isSuccessful, message} = response.body;
                ctx.body = new ResponseBody<Device[]>(isSuccessful, message);
            }
        }
    });


    router.get('/api/searchDeviceOnID', async (ctx) => {
        if ((typeof ctx.request.query.keyword !== 'string' && typeof ctx.request.query.keyword !== 'undefined')) {
            ctx.body = invalidParameter();
        } else {
            let {keyword} = ctx.request.query;
            const {userID} = ctx.session!.data!;
            const response = await searchDeviceOnID(keyword, userID);
            if (response.body.data && response.body.isSuccessful) {
                const {isSuccessful, message, data} = response.body;
                ctx.body = new ResponseBody<Device[]>(isSuccessful, message, data);
            } else {
                const {isSuccessful, message} = response.body;
                ctx.body = new ResponseBody<Device[]>(isSuccessful, message);
            }
        }
    });

    router.get('/api/queryDeviceInfo', async (ctx) => {
        if (!is_number(ctx.request.query.deviceID)) {
            ctx.body = invalidParameter();
        } else {
            let {deviceID} = ctx.request.query;
            const response = await queryDeviceInfo(deviceID);
            if (response.body.data && response.body.isSuccessful) {
                const {isSuccessful, message, data} = response.body;
                ctx.body = new ResponseBody<DeviceInfo>(isSuccessful, message, data);
            } else {
                const {isSuccessful, message} = response.body;
                ctx.body = new ResponseBody<DeviceInfo>(isSuccessful, message);
            }
        }
    });

    router.get('/api/queryDeviceAmount', async (ctx) => {
        const response = await queryDeviceAmount();
        const {isSuccessful, message, data} = response.body;
        ctx.body = new ResponseBody<number>(isSuccessful, message, data);
    });

    router.post('/api/checkDevicePicture', checkDvSupSession, async (ctx) => {
        //????????????????????????
        if (typeof ctx.request.body.deviceID !== 'number') {
            ctx.body = invalidParameter();
        } else {
            const {deviceID} = ctx.request.body;
            const {userID} = ctx.session!.data!;
            const response = await checkDevicePicture(deviceID, userID);
            const {isSuccessful, message} = response.body;
            ctx.body = new ResponseBody(isSuccessful, message);
        }
    });

    router.post('/api/addDevicePicture', checkDvSupSession, async (ctx) => {
        if (!is_number(ctx.request.body.deviceID)) {
            ctx.body = invalidParameter();
        } else {
            let {deviceID} = ctx.request.body;
            deviceID = Number(deviceID);
            if (ctx.request.files !== undefined) {
                const {files} = ctx.request.files;
                const {userID} = ctx.session!.data!
                //@ts-ignore
                const response = await addDevicePicture(deviceID, files, userID);
                const {isSuccessful, message} = response.body;
                ctx.body = new ResponseBody(isSuccessful, message);
            } else {
                ctx.body = invalidParameter();
            }
        }
    });

    router.post('/api/selectDeviceCover', checkDvSupSession, async (ctx) => {
        if (typeof ctx.request.body.deviceID !== 'number' || typeof ctx.request.body.pictureID !== 'number') {
            ctx.body = invalidParameter();
        } else {
            const {deviceID, pictureID} = ctx.request.body;
            const {userID} = ctx.session!.data!;
            const response = await selectDeviceCover(deviceID, pictureID, userID);
            const {isSuccessful, message} = response.body;
            ctx.body = new ResponseBody<void>(isSuccessful, message);
        }
    });

    router.get('/api/queryDeviceCover', async (ctx) => {
        if (!is_number(ctx.request.query.deviceID)) {
            ctx.body = invalidParameter();
        } else {
            let {deviceID} = ctx.request.query;
            deviceID = Number(deviceID);
            const response = await queryDeviceCover(deviceID);
            if (response.body.isSuccessful && response.body.data) {
                let {isSuccessful, message, data} = response.body;
                // data = utilx.absoluteToNetwork(data);
                data = utilx.devicePictureToNetwork(data);
                ctx.body = new ResponseBody<string>(isSuccessful, message, data);
            } else {
                const {isSuccessful, message} = response.body;
                ctx.body = new ResponseBody<string>(isSuccessful, message);
            }
        }
    });

    router.post('/api/checkDeviceAttachment', checkDvSupSession, async (ctx) => {
        if (typeof ctx.request.body.deviceID !== 'number' || !Array.isArray(ctx.request.body.fileNames) || !Array.isArray(ctx.request.body.fileSizes)) {
            ctx.body = invalidParameter();
        } else {
            let {deviceID, fileNames, fileSizes} = ctx.request.body;
            fileNames.forEach((item: any) => { //?????????????????????????????????
                if (typeof item !== 'string') {
                    ctx.body = invalidParameter();
                    return;
                }
            });
            fileSizes.forEach((item: any) => {//????????????????????????number
                if (typeof item !== 'number') {
                    ctx.body = invalidParameter();
                    return;
                }
            })
            if (fileSizes.length !== fileNames.length) { //????????????????????????????????????
                ctx.body = invalidParameter();
                return;
            }
            deviceID = Number(deviceID);
            const {userID} = ctx.session!.data!;
            const response = await checkDeviceAttachment(deviceID, fileNames, userID, fileSizes);
            const {isSuccessful, message} = response.body;
            ctx.body = new ResponseBody(isSuccessful, message);
        }
    });

    router.post('/api/addDeviceAttachment', checkDvSupSession, async (ctx) => {
        // @ts-ignore
        if (ctx.request.files !== undefined && !utilx.checkAttachment(ctx.request.files)) {
            if (!is_number(ctx.request.body.deviceID)) {
                ctx.body = invalidParameter();
            } else {
                let {deviceID} = ctx.request.body;
                deviceID = Number(deviceID);
                const {files} = ctx.request.files;
                const {userID} = ctx.session!.data!;
                const response = await addDeviceAttachment(deviceID, files, userID);
                const {isSuccessful, message} = response.body;
                ctx.body = new ResponseBody<void>(isSuccessful, message);
            }
        } else {
            ctx.body = new ResponseBody(false, 'invalidFileType');
        }
    });

    router.post('/api/deleteDevicePicture', checkDvSupSession, async (ctx) => {
        if (typeof ctx.request.body.deviceID !== 'number' || !Array.isArray(ctx.request.body.pictureID)) {
            ctx.body = invalidParameter();
        } else {
            const {deviceID, pictureID} = ctx.request.body;
            const {userID} = ctx.session!.data!;
            const response = await deleteDevicePicture(deviceID, pictureID, userID);
            const {isSuccessful, message} = response.body;
            ctx.body = new ResponseBody<void>(isSuccessful, message);
        }
    });

    router.post('/api/deleteDeviceAttachment', checkDvSupSession, async (ctx) => {
        if (typeof ctx.request.body.deviceID !== 'number' || !Array.isArray(ctx.request.body.fileID)) {
            ctx.body = invalidParameter();
        } else {
            const {deviceID, fileID} = ctx.request.body;
            const {userID} = ctx.session!.data!;
            const response = await deleteDeviceAttachment(deviceID, fileID, userID);
            const {isSuccessful, message} = response.body;
            ctx.body = new ResponseBody<void>(isSuccessful, message);
        }
    });

    router.post('/api/addDeviceStereoPicture', checkDvSupSession, async (ctx) => {
        if (ctx.request.files !== undefined) {
            if (!is_number(ctx.request.body.deviceID)) {
                ctx.body = invalidParameter();
            } else {
                let {deviceID} = ctx.request.body;
                deviceID = Number(deviceID);
                const {files} = ctx.request.files;
                const {userID} = ctx.session!.data!;
                //@ts-ignore
                const response = await addDeviceStereoPicture(deviceID, files, userID);
                const {isSuccessful, message} = response.body;
                ctx.body = new ResponseBody<void>(isSuccessful, message);
            }
        }
    });

    router.get('/api/queryDeviceStereoPicture', async (ctx) => {
        if (!is_number(ctx.request.query.deviceID)) {
            ctx.body = invalidParameter();
        } else {
            let {deviceID} = ctx.request.query;
            const response = await queryDeviceStereoPicture(Number(deviceID));
            if (response.body.isSuccessful && response.body.data) {
                let {isSuccessful, message, data} = response.body;
                for (let i = 0; i < data.length; i++) {
                    data[i] = utilx.devicePictureToNetwork(data[i]);
                }
                ctx.body = new ResponseBody<string[]>(isSuccessful, message, data);
            } else {
                const {isSuccessful, message} = response.body;
                ctx.body = new ResponseBody<string[]>(isSuccessful, message);
            }
        }
    });

    router.post('/api/deleteDeviceStereoPicture', checkDvSupSession, async (ctx) => {
        if (typeof ctx.request.body.deviceID !== 'number') {
            ctx.body = invalidParameter();
        } else {
            const {deviceID} = ctx.request.body;
            const {userID} = await ctx.session!.data!;
            const response = await deletedDeviceStereoPicture(deviceID, userID);
            const {isSuccessful, message} = response.body;
            ctx.body = new ResponseBody<void>(isSuccessful, message);
        }
    });

    router.get('/api/queryUpdateStatus', checkDvSupSession, async (ctx) => {
        if (!is_number(ctx.request.query.deviceID)) {
            ctx.body = invalidParameter();
        } else {
            let {deviceID} = ctx.request.query;
            const {userID} = ctx.session!.data!;
            const response = await queryUpdateStatus(deviceID, userID);
            if (response.body.isSuccessful && response.body.data) {
                const {isSuccessful, message, data} = response.body;
                ctx.body = new ResponseBody<number>(isSuccessful, message, data);
            } else {
                const {isSuccessful, message} = response.body;
                ctx.body = new ResponseBody<number>(isSuccessful, message);
            }
        }
    });

    router.get("/api/queryDevicePictures", async (ctx): Promise<void> => {
        if (!is_number(ctx.request.query.deviceID)) {
            ctx.body = new ResponseBody<PictureInfo[]>(false, 'invalidParameter');
        } else {
            let {deviceID} = ctx.request.query;
            deviceID = Number(deviceID);
            const response = await queryDevicePictures(deviceID);
            if (response.body.isSuccessful && response.body.data) {
                let {isSuccessful, message, data} = response.body;
                data.forEach((item) => {
                    // item.filePath = utilx.absoluteToNetwork(item.filePath);
                    item.filePath = utilx.devicePictureToNetwork(item.filePath);
                })
                ctx.body = new ResponseBody<PictureInfo[]>(isSuccessful, message, data);
            } else {
                const {isSuccessful, message} = response.body;
                ctx.body = new ResponseBody<PictureInfo[]>(isSuccessful, message);
            }
        }
    });

    router.get('/api/listDeviceOnID', checkDvSupSession, async (ctx) => {
        if (!is_number(ctx.request.query.offset) || !is_number(ctx.request.query.limit) || !is_number(ctx.request.query.userID)) {
            ctx.body = invalidParameter();
        } else {
            let {offset, limit, userID} = ctx.request.query;
            offset = Number(offset);
            limit = Number(limit);
            userID = Number(userID);
            const sessionUserID = (ctx.session!.data!).userID;
            const response = await listDeviceOnID(offset, limit, userID, sessionUserID);
            if (response.body.data && response.body.isSuccessful) {
                const {isSuccessful, message, data} = response.body;
                ctx.body = new ResponseBody<Device[]>(isSuccessful, message, data);
            } else {
                const {isSuccessful, message} = response.body;
                ctx.body = new ResponseBody<Device[]>(isSuccessful, message);
            }
        }
    });

    router.get("/api/queryDeviceAmountOnID", checkDvSupSession, async (ctx) => {
        const {userID} = ctx.session!.data!;
        const response = await queryDeviceAmountOnID(userID);
        const {isSuccessful, message, data} = response.body;
        ctx.body = new ResponseBody<number>(isSuccessful, message, data);
    });

    router.get('/api/queryDeletedDeviceAmount', checkSupervisorSession, async (ctx) => {
        const {userID} = ctx.session!.data!;
        const response = await queryDeletedDeviceAmount(userID);
        const {isSuccessful, message, data} = response.body;
        ctx.body = new ResponseBody<number>(isSuccessful, message, data);
    });

    router.get('/api/queryAttachment', async (ctx) => {
        if (!is_number(ctx.request.query.deviceID)) {
            ctx.body = invalidParameter();
        } else {
            let {deviceID} = ctx.request.query;
            deviceID = Number(deviceID);
            const response = await queryDeviceAttachment(deviceID);
            console.log(response.body.data);
            if (response.body.isSuccessful && response.body.data) {
                const {isSuccessful, message, data} = response.body;
                data.forEach((item) => {
                    // item.filePath = utilx.absoluteToNetwork(item.filePath);
                    item.filePath = utilx.deviceAttachmentToNetwork(item.filePath);
                })
                ctx.body = new ResponseBody<AttachmentInfo[]>(isSuccessful, message, data);
            } else {
                const {isSuccessful, message} = response.body;
                ctx.body = new ResponseBody<AttachmentInfo[]>(isSuccessful, message);
            }
        }
    });

    router.post('/api/deleteDeviceData', checkDvSupSession, async (ctx) => {
        if (typeof ctx.request.body.deviceID !== 'number' || typeof ctx.request.body.dataCategoryID !== 'number') {
            ctx.body = invalidParameter();
        } else {
            const {deviceID, dataCategoryID} = ctx.request.body;
            const {userID} = ctx.session!.data!;
            const response = await deleteDeviceData(deviceID, dataCategoryID, userID);
            const {isSuccessful, message} = response.body;
            ctx.body = new ResponseBody<void>(isSuccessful, message);
        }
    });

    router.post('/api/checkDeviceStereoPicture', checkDvSupSession, async (ctx) => {
        if (typeof (ctx.request.body.deviceID) !== 'number' || !Array.isArray(ctx.request.body.fileNames) || !Array.isArray(ctx.request.body.fileSizes)) {
            ctx.body = invalidParameter();
        } else {
            let {deviceID, fileNames, fileSizes} = ctx.request.body;
            let {userID} = ctx.session!.data!;
            const response = await checkDeviceStereoPicture(deviceID, fileNames, fileSizes, userID);
            const {isSuccessful, message} = response.body;
            ctx.body = new ResponseBody<void>(isSuccessful, message);
        }
    });

    router.post('/api/destroyDevice', checkDvSupSession, async (ctx) => {
        if (typeof ctx.request.body.deviceID !== 'number') {
            ctx.body = invalidParameter();
        } else {
            const {deviceID} = ctx.request.body;
            const {userID} = ctx.session!.data!
            const response = await destroyDevice(deviceID, userID);
            const {isSuccessful, message} = response.body;
            ctx.body = new ResponseBody<void>(isSuccessful, message);
        }
    });
}