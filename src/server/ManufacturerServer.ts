import {ResponseServer} from "../instances/responseServer";
import {
    addManufacturer as addManufacturerDB,
    deletedManufacturerRecover as deletedManufacturerRecoverDB,
    deleteManufacturer as deleteManufacturerDB,
    listDeletedManufacturer as listDeletedManufacturerDB,
    listManufacturer as listManufacturerDB,
    modifyManufacturer as modifyManufacturerDB,
    queryManufacturer as queryManufacturerDB,
    queryManufacturerInfoAmount as queryManufacturerInfoAmountDB,
    searchDeletedManufacturer as searchDeletedManufacturerDB,
    searchManufacturer as searchManufacturerDB,
    isUserBelongToManufacturer,
    userJoinManufacturer as userJoinManufacturerDB,
    userLeaveManufacturer as userLeaveManufacturerDB,
    listManufacturerOnID as listManufacturerOnIDDB,
    queryManufacturerInfoAmountInfoOnID as queryManufacturerInfoAmountInfoOnIDDB,
    queryDeletedManufacturerInfoAmount as queryDeletedManufacturerInfoAmountDB,
} from "../database/ManufacturerDatabase";
import {permissionDeny} from "./permissionDeny";
import {ManufacturerInfo} from "../Class/ManufacturerInfo";
import {checkDvSupSession, checkSupervisorSession} from "./checkPermission";

import {UserType} from "../Enum/UserType";
import {ResponseDB} from "../instances/ResponseDB";
import {utilx} from "../instances/utilx";


export async function addManufacturer(manufacturerName: string, manufacturerTelephone: string, manufacturerIntroduction: string, manufacturerAddress: string, sessionUserID: number): Promise<ResponseServer<void>> {
    const parsedManufacturerAddress: string[] | null = utilx.checkManufacturerAddress(manufacturerAddress);
    if(!parsedManufacturerAddress){//不符合格式
        return new ResponseServer<void>(
            new ResponseDB<void>(false,'invalidParameter')
        );
    }else {
        const response = await addManufacturerDB(manufacturerName, manufacturerTelephone, manufacturerIntroduction, manufacturerAddress, sessionUserID);
        return new ResponseServer<void>(response);
    }
}

export async function modifyManufacturer(manufacturerInfo: ManufacturerInfo, sessionUserID: number): Promise<ResponseServer<void>> {
    const res = await checkDvSupSession(sessionUserID);
    if (res.body.isSuccessful && res.body.data) {
        const userType = res.body.data.userType;
        if (userType === UserType.SUPERVISOR) {//是超管
            const response = await modifyManufacturerDB(manufacturerInfo);
            return new ResponseServer<void>(response);
        } else if (userType === UserType.DEVICEADMIN) {//是设备管理员
            const relation = await isUserBelongToManufacturer(res.body.data.ID, manufacturerInfo.manufacturerID);
            if (relation.isSuccessful) {//在用户-厂商表中有关系
                const response = await modifyManufacturerDB(manufacturerInfo);
                return new ResponseServer<void>(response);
            } else {
                return permissionDeny<void>();
            }
        } else {
            return permissionDeny<void>();
        }
    } else {
        return permissionDeny<void>();
    }

}

export async function deleteManufacturer(manufacturerID: number, sessionUserID: number): Promise<ResponseServer<void>> {
    const res = await checkDvSupSession(sessionUserID);
    if (res.body.isSuccessful) {
        const response = await deleteManufacturerDB(manufacturerID);
        return new ResponseServer<void>(response);
    } else {
        return permissionDeny<void>();
    }
}

export async function deletedManufacturerRecover(manufacturerID: number, sessionUserID: number): Promise<ResponseServer<void>> {
    const res = await checkDvSupSession(sessionUserID);
    if (res.body.isSuccessful) {
        const response = await deletedManufacturerRecoverDB(manufacturerID);
        return new ResponseServer<void>(response);
    } else {
        return permissionDeny<void>();
    }
}

export async function listManufacturer(offset: number, limit: number): Promise<ResponseServer<ManufacturerInfo[]>> {
    const response = await listManufacturerDB(offset, limit);
    return new ResponseServer<ManufacturerInfo[]>(response);
}

export async function listDeletedManufacturer(offset: number, limit: number, sessionUserID: number): Promise<ResponseServer<ManufacturerInfo[]>> {
    const res = await checkSupervisorSession(sessionUserID);
    if (res.body.isSuccessful) {
        const response = await listDeletedManufacturerDB(offset, limit);
        return new ResponseServer<ManufacturerInfo[]>(response);
    } else {
        return new ResponseServer<ManufacturerInfo[]>(
            new ResponseDB(false, 'invalidCall')
        );
    }
}

export async function searchManufacturer(keyword: string): Promise<ResponseServer<ManufacturerInfo[]>> {
    if ( keyword === '') {
        return new ResponseServer<ManufacturerInfo[]>(
            new ResponseDB(false, 'invalidParameter')
        );
    }
    const response = await searchManufacturerDB(keyword);
    return new ResponseServer<ManufacturerInfo[]>(response);
}

export async function searchDeletedManufacturer(keyword: string, sessionUserID: number): Promise<ResponseServer<ManufacturerInfo[]>> {
    if ( keyword === '') {
        return new ResponseServer<ManufacturerInfo[]>(
            new ResponseDB(false, 'invalidParameter')
        );
    }
    const res = await checkSupervisorSession(sessionUserID);
    if (res.body.isSuccessful) {
        const response = await searchDeletedManufacturerDB(keyword);
        return new ResponseServer<ManufacturerInfo[]>(response);
    } else {
        return new ResponseServer<ManufacturerInfo[]>(
            new ResponseDB(false, 'invalidCall')
        );
    }
}

export async function queryManufacturer(manufacturerInfoID: number): Promise<ResponseServer<ManufacturerInfo>> {
    const response = await queryManufacturerDB(manufacturerInfoID);
    return new ResponseServer<ManufacturerInfo>(response);
}

export async function queryManufacturerInfoAmount(): Promise<ResponseServer<number>> {
    const response = await queryManufacturerInfoAmountDB();
    return new ResponseServer<number>(response);
}

export async function queryDeletedManufacturerInfoAmount(sessionUserID:number):Promise<ResponseServer<number>>{
    const res = await checkSupervisorSession(sessionUserID);
    if(res.body.isSuccessful && res.body.data) {
        const response = await queryDeletedManufacturerInfoAmountDB();
        return new ResponseServer<number>(response);
    } else {
        return permissionDeny<number>();
    }
}

export async function listManufacturerOnID(offset: number, limit: number, userID: number, sessionUserID: number): Promise<ResponseServer<ManufacturerInfo[]>> {
    const res = await checkSupervisorSession(sessionUserID);
    if (res.body.isSuccessful && res.body.data) {//是超管 可以随意查询任意人的厂商列表
        const response = await listManufacturerOnIDDB(offset, limit, userID);
        return new ResponseServer<ManufacturerInfo[]>(response);
    } else {
        if (userID !== sessionUserID) {
            return permissionDeny<ManufacturerInfo[]>()
        } else {
            const response = await listManufacturerOnIDDB(offset, limit, userID);
            return new ResponseServer<ManufacturerInfo[]>(response);
        }
    }
}

export async function queryManufacturerInfoAmountInfoOnID(userID: number): Promise<ResponseServer<number>> {
    const response = await queryManufacturerInfoAmountInfoOnIDDB(userID);
    return new ResponseServer<number>(response);
}

export async function userJoinManufacturer(manufacturerID: number, sessionID: number): Promise<ResponseServer<void>> {//机器人管理员主动加入厂商
    const res = await checkDvSupSession(sessionID);
    if (res.body.isSuccessful) {
        const response = await userJoinManufacturerDB(sessionID, manufacturerID);
        return new ResponseServer<void>(response);
    } else {
        return permissionDeny<void>();
    }
}

export async function userLeaveManufacturer(manufacturerID: number, sessionID: number) {//机器人管理员主动退出厂商
    const res = await checkDvSupSession(sessionID);
    if (res.body.isSuccessful) {
        const response = await userLeaveManufacturerDB(sessionID, manufacturerID);
        return new ResponseServer<void>(response);
    } else {
        return permissionDeny<void>();
    }
}