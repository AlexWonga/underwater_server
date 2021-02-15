import {ResponseServer} from "../../Instances/ResponseServer";
import {checkSuperVisorPermission} from '../../Database/CheckPermissionDatabase'
import {checkDvSupSession as checkDvSupSessionDB} from "../../Database/CheckPermissionDatabase";
import {UserInfo} from "../../Database/Models/UserSupervisorModel";

export async function checkSupervisorSession(userID: number): Promise<ResponseServer<UserInfo>> {
    const DBResponse = await checkSuperVisorPermission(userID);
    return new ResponseServer(DBResponse);
}

//检查设备管理员或是超管的权限
export async function checkDvSupSession(userID: number): Promise<ResponseServer<UserInfo>> {
    const DBResponse = await checkDvSupSessionDB(userID);
    return new ResponseServer<UserInfo>(DBResponse);
}