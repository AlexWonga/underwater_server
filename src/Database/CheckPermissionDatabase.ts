import {UserInfo} from "./Models/UserSupervisorModel";
import {ResponseDB} from "../Instances/ResponseDB";
import {UserType} from "../Enum/UserType";


export async function checkSuperVisorPermission(UserID: number): Promise<ResponseDB<UserInfo>> {//检查超管session信息数据库层
    //console.log(UserID);
    const User = await UserInfo.findOne({
        attributes: ['userType'],
        where: {ID: UserID},

    });
    if (User === null) {
        return new ResponseDB<UserInfo>(false, 'userNotFound');
    }
    const {userType} = User;
    //console.log(UserType);
    if (userType !== UserType.SUPERVISOR)//对比用户类型以确认身份
        return new ResponseDB<UserInfo>(false, 'invalidCall');
    else {
        return new ResponseDB<UserInfo>(true, 'checkPermissionSuccess',User);
    }
}

//checkSuperVisorPermission(2);
export async function checkDvSupSession(userID: number): Promise<ResponseDB<UserInfo>> {
    const user = await UserInfo.findOne({
        where: {
            ID: userID,
        }
    });
    if (user === null) {
        return new ResponseDB<UserInfo>(false, 'userNotFound');
    } else {
        const {userType} = user;
        if (userType === UserType.BROWSEUSER) { //如果是游客就不能访问
            return new ResponseDB<UserInfo>(false, 'PermissionDeny');
        } else {
            if(userType === UserType.SUPERVISOR){
                return new ResponseDB<UserInfo>(true, 'SessionExist',user);
            }
            else if (userType === UserType.DEVICEADMIN){
                return new ResponseDB<UserInfo>(true, 'SessionExist',user);
            }
            else{
                return new ResponseDB<UserInfo>(false,'invalidUserType');
            }
        }
    }
}