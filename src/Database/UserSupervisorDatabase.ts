import {ResponseDB} from "../Instances/ResponseDB";
import {UserType} from "../Enum/UserType";
import {UserInfo as UserInfoModel} from "../Class/UserInfo";
import {sequelize} from "./DB";
import {UserInfo} from "./Models/UserSupervisorModel";
import {Op} from "sequelize";
import moment from "moment";

export async function queryUserInfo(UserID: number): Promise<ResponseDB<UserInfoModel>> {//根据id查询用户
    const User = await UserInfo.findOne({
        where: {
            ID: UserID,
        },

    });
    //console.log(User.toJSON());
    if (User === null) {
        return new ResponseDB<UserInfoModel>(false, 'userNotFound');
    } else {
        const {ID, username, password, telephone, email, userType, lastLogin, createdAt} = User;
        let result = new UserInfoModel(ID, username, password, telephone, email, userType, lastLogin.getTime(), createdAt.getTime());
        return new ResponseDB<UserInfoModel>(true, 'queryUserInfoSuccess', result);
    }
}

export async function supervisorLogin(username: string, password: string): Promise<ResponseDB<UserInfoModel>> {//用户登录
    // const t = await sequelize.transaction();

    const UserA = await UserInfo.findOne({
            where: {
                username: username,
            },
        }
    );
    if (UserA === null || UserA.password !== password || UserA.userType !== 'SUPERVISOR') {
        return new ResponseDB<UserInfoModel>(false, 'wrongUserOrPassword');
    } else {
        UserA.lastLogin = new Date();
        await UserA.save();
        const {ID, username, telephone, email, userType, lastLogin, createdAt} = UserA;
        let result = new UserInfoModel(ID, username, '', telephone, email, userType, lastLogin.getTime(), createdAt.getTime());
        return new ResponseDB<UserInfoModel>(true, 'superVisorLoginSuccess', result);
        //console.log(responseDB);
    }

}


export async function addUser(username: string, UserType: UserType, password: string, telephone: string, email: string): Promise<ResponseDB<void>> {
    try {
        const user = await UserInfo.create({
            username: username,
            password: password,
            telephone: telephone,
            email: email,
            userType: UserType,
            lastLogin: moment().format(),
        });
        if (user) {
            return new ResponseDB<void>(true, 'addUserSuccess');
        } else {
            return new ResponseDB<void>(false, 'addUserFailed');
        }
    } catch (e) {
        if (e.name === "SequelizeUniqueConstraintError") {
            return new ResponseDB<void>(false, 'duplicateUsername');//重复的用户名
        } else {
            throw e;
        }
    }
}

export async function modifyUserInfo(ID: number, username: string, UserType: UserType, password: string, telephone: string, email: string): Promise<ResponseDB<void>> {
    const t = await sequelize.transaction();

    try {
        let tempUser = await UserInfo.findOne({
            where: {
                ID: ID,
                username: username,//?
            },
        });
        if (tempUser === null) {
            return new ResponseDB<void>(false, 'userNotFound');
        } else {
            if (password === '') {
                return new ResponseDB<void>(false, 'invalidPassword');
            }
            tempUser.userType = UserType;
            tempUser.email = email;
            tempUser.telephone = telephone;
            tempUser.password = password;
            //tempUser.username = username;//?
            await tempUser.save();
            //tempUser.destroy();
            await t.commit();
            return new ResponseDB<void>(true, 'modifyUserInfoSuccess');
        }
    } catch (e) {
        await t.rollback();
        throw e;
    }
}

export async function listUserInfo(offset: number, limit: number): Promise<ResponseDB<UserInfoModel[]>> {

    const userList = await UserInfo.findAll({
        order: ['ID'],
        offset: offset,
        limit: limit,
    });
    let result: UserInfoModel[] = [];
    userList.forEach((item) => {
        const {ID, username, telephone, email, userType, lastLogin, createdAt} = item;
        result.push(new UserInfoModel(ID, username, '', telephone, email, userType, lastLogin.getTime(), createdAt.getTime()));
    })
    return new ResponseDB<UserInfoModel[]>(true, 'listUserInfoSuccess', result);
}

export async function queryUserAmount(userType: UserType): Promise<ResponseDB<number>> {
    const amount = await UserInfo.count({
        where: {
            userType: userType,
        },
    });
    return new ResponseDB<number>(true, 'amountQuerySuccess', amount);
}

export async function searchUser(keyword: string): Promise<ResponseDB<UserInfoModel[]>> {
    const user = await UserInfo.findAll({
        where: {
            username: {[Op.like]: "%" + keyword + "%"},
        }
    });
    if (user) {
        let result: UserInfoModel[] = [];
        user.forEach((item) => {
            const {ID, username, telephone, email, password, userType, lastLogin, createdAt} = item;
            result.push(new UserInfoModel(ID, username, password, telephone, email, userType, lastLogin.getTime(), createdAt.getTime()));
        });
        return new ResponseDB<UserInfoModel[]>(true, 'searchUserInfoSuccess', result);
    } else {
        return new ResponseDB<UserInfoModel[]>(true, 'searchUserInfoSuccess');
    }
}

// (async ()=>{
//      let user = await UserInfo.findOne();
//      if(user){
//          console.log(user);
//          user.telephone = '456';
//          await user.save();
//      }
//     // const user = await UserInfo.build({ID:2,username:'1',password:'2',telephone:'3',email:'4',userType:UserType.SUPERVISOR});
//     // await user.save();
// })()


// modifyUserInfo(1,'1',UserType.SUPERVISOR,'123','456','789');