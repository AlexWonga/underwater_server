import {UserInfo} from "./Models/UserSupervisorModel";
import {ResponseDB} from "../instances/ResponseDB";
import {UserType} from "../Enum/UserType";
import {UserInfo as UserInfoModel} from "../Class/UserInfo";

export async function userLogin(username: string, password: string): Promise<ResponseDB<UserInfoModel>> {
    const User = await UserInfo.findOne({
        where: {
            username: username,
        }
    });
    if (User === null || User.userType === UserType.SUPERVISOR || User.password !== password) {
        return new ResponseDB<UserInfoModel>(false, 'wrongUserOrPassword');
    } else {
        const {ID, username, telephone, email, userType, lastLogin, createdAt} = User;
        User.lastLogin = new Date();
        await User.save();
        const result = new UserInfoModel(ID, username, '', telephone, email, userType, lastLogin.getTime(), createdAt.getTime())
        return new ResponseDB<UserInfoModel>(true, 'UserLoginSuccess', result);
    }

}