import {ResponseServer} from "../instances/ResponseServer";
import {checkSuperVisorPermission} from '../database/checkPermissionDatabase'
import {checkDvSupSession as checkDvSupSessionDB} from "../database/checkPermissionDatabase";
import {UserInfo} from "../database/Models/UserSupervisorModel";

export async function checkSupervisorSession(userID: number): Promise<ResponseServer<UserInfo>> {
    const DBResponse = await checkSuperVisorPermission(userID);
    return new ResponseServer(DBResponse);
}

//检查设备管理员或是超管的权限
export async function checkDvSupSession(userID: number): Promise<ResponseServer<UserInfo>> {
    const DBResponse = await checkDvSupSessionDB(userID);
    return new ResponseServer<UserInfo>(DBResponse);
}