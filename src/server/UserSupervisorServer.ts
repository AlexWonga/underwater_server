import {ResponseServer} from "../instances/responseServer";
import {ResponseDB} from "../instances/ResponseDB";
import {
    supervisorLogin as supervisorLoginDB,
    addUser as addUserDB,
    queryUserInfo as queryUserInfoDB,
    modifyUserInfo as modifyUserInfoDB,
    searchUser as searchUserDB,
    queryUserAmount as queryUserAmountDB,
} from "../database/UserSupervisorDatabase";
import {UserInfo as UserInfoModel} from "../Class/UserInfo";
import {UserType} from "../Enum/UserType";
import {checkSupervisorSession} from "./checkPermission";
import {listUserInfo as listUserInfoDB} from "../database/UserSupervisorDatabase";
import {IUser} from "../Class/IUser";
import {ISession} from "../interface/session";
import {permissionDeny} from "./permissionDeny";


export async function supervisorLogin(username: string, password: string): Promise<ResponseServer<UserInfoModel>> {
    const DBResponse = await supervisorLoginDB(username, password);//数据库层的response
    if (DBResponse.data) { //如果成功查找到用户，应该传回一个session
        const session: ISession = {
            userID: DBResponse.data.ID,
            username: DBResponse.data.username,
        };
        const newResponse = new ResponseDB<UserInfoModel>(DBResponse.isSuccessful, DBResponse.message);
        return new ResponseServer<UserInfoModel>(newResponse, session);
    } else {//不成功的话 不传session
        const newResponse = new ResponseDB<UserInfoModel>(DBResponse.isSuccessful, DBResponse.message);
        return new ResponseServer<UserInfoModel>(newResponse, undefined);
    }
}

export async function queryUserInfo(userID: number): Promise<ResponseServer<UserInfoModel>> {
    const User = await queryUserInfoDB(userID);
    return new ResponseServer<UserInfoModel>(User);
}


export async function addUserInfo(username: string, userType: UserType, password: string, telephone: string, email: string): Promise<ResponseServer<void>> {
    const response = await addUserDB(username, userType, password, telephone, email);
    return new ResponseServer<void>(response);
}


export async function modifyUserInfo(userID: number, pwd?: string, tel?: string, NewEmail?: string): Promise<ResponseServer<void>> {
    const User = await queryUserInfo(userID);
    console.log('pp',pwd);
    if (User.body.isSuccessful && User.body.data !== undefined) {
        let UserA: IUser = new IUser(userID, pwd, tel, NewEmail);
        let res = JSON.parse(JSON.stringify(UserA));//这一步用于将undefined的属性去掉
        console.log("res",res);
        console.log(User.body.data);
        const newUser = Object.assign(User.body.data, res);
        const {ID, username, userType, password, telephone, email} = newUser;
        console.log("gg",ID,username,userType,password,telephone,email);
        const result = await modifyUserInfoDB(ID, username, userType, password, telephone, email);
        return new ResponseServer<void>(result);
    } else {
        return new ResponseServer<void>(new ResponseDB<void>(false, 'invalidUser'));
    }
}

export async function listUserInfo(offset: number, limit: number, sessionUserID: number): Promise<ResponseServer<UserInfoModel[]>> {
    const res = await checkSupervisorSession(sessionUserID);
    if (!res.body.isSuccessful) {
        return new ResponseServer<UserInfoModel[]>(new ResponseDB<UserInfoModel[]>(false, 'invalidCall'));
    } else {
        const result = await listUserInfoDB(offset, limit);
        return new ResponseServer<UserInfoModel[]>(result);
    }
}

export async function searchUserInfo(keyword:string,sessionUserID:number):Promise<ResponseServer<UserInfoModel[]>>{
    if(keyword === ""){
        return new ResponseServer<UserInfoModel[]>(
            new ResponseDB(false,'invalidParameter')
        );
    }else {
        const res =await checkSupervisorSession(sessionUserID);
        if(res.body.data&&res.body.isSuccessful){
            const response = await searchUserDB(keyword);
            return new ResponseServer<UserInfoModel[]>(response);
        } else {
            return permissionDeny<UserInfoModel[]>();
        }
    }
}

export async function queryUserAmount(userType:UserType,sessionUserID:number):Promise<ResponseServer<number>>{
    const res = await checkSupervisorSession(sessionUserID);
    if(res.body.data && res.body.isSuccessful){
        const response = await queryUserAmountDB(userType);
        return new ResponseServer<number>(response);
    } else {
        return permissionDeny<number>();
    }
}