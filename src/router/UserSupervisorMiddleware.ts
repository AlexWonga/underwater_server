/**
 * 所有的类型断言已经在上一中间件中确认过
 */


import {ResponseBody} from "../instances/ResponseBody";
import {invalidParameter} from "./invalidParameter";

import {
    addUserInfo,
    listUserInfo,
    modifyUserInfo,
    queryUserAmount,
    queryUserInfo,
    searchUserInfo,
    supervisorLogin,
} from "../server/UserSupervisorServer"
import {checkDvSupSession, checkSessionText, checkSupervisorSession} from "./checkPermissionMiddleware";
import Router from 'koa-router';
import {checkType} from "../instances/checkType";
import {checkSupervisorSession as serverCheckSupervisorSession} from "../server/checkPermission";
import {UserInfo} from "../Class/UserInfo";
import is_number from "is-number";
import {IContext, ISession, IState} from "../interface/session";
import {changeCapcha} from "./createCapcha";

module.exports = (router: Router<IState, IContext>) => {
    router.get('/api/captcha', async (ctx) => {
        const data = await changeCapcha(ctx);
        ctx.body = {svgData: data};
    });

    router.post('/api/supervisorLogin', checkSessionText, async (ctx): Promise<void> => {//超管登陆
        if (typeof (ctx.request.body.username) !== "string" || typeof (ctx.request.body.password) !== "string" || typeof (ctx.request.body.code) !== "string") {//检查参数类型 code是图形验证码的答案
            ctx.body = invalidParameter();
        } else {
            let {username, password, code} = ctx.request.body;//从请求中取出用户名与密码
            const text = ctx.session.text;
            if (text === null || text.toLowerCase() !== code.toString().toLowerCase()) {
                const svgData = await changeCapcha(ctx);
                ctx.body = new ResponseBody<string>(false, 'wrongVerificationCode', svgData);
            } else {
                const response = await supervisorLogin(username, password);//服务层返回的response
                if (response.session) {//如果session不为空 就设置session
                    ctx.session.data = response.session;
                }
                const {isSuccessful, message} = response.body;
                if (!isSuccessful) {
                    const svgData = await changeCapcha(ctx);
                    ctx.body = new ResponseBody<string>(isSuccessful, message, svgData);
                } else {
                    ctx.body = new ResponseBody<void>(isSuccessful, message);
                }
            }
        }
        // await next();
    });
    router.post('/api/addUser', checkSupervisorSession, async (ctx): Promise<void> => {//添加用户
        //console.log(ctx.request.body);
        if (!checkType.instanceOfUserType(ctx.request.body.userType)) {//检查该参数是不是设定的用户类型枚举类型
            ctx.body = new ResponseBody<void>(false, 'invalidUserType');
        } else if (typeof ctx.request.body.username !== 'string' || typeof ctx.request.body.password !== 'string' || typeof ctx.request.body.telephone !== 'string' || typeof ctx.request.body.email !== 'string') {
            ctx.body = invalidParameter();
        } else {
            const {username, userType, password, telephone, email} = ctx.request.body;
            const response = await addUserInfo(username, userType, password, telephone, email);
            const {isSuccessful, message} = response.body;
            ctx.body = new ResponseBody<void>(isSuccessful, message);
        }
    });
    router.get('/api/queryUserInfo', checkDvSupSession, async (ctx): Promise<void> => {//超管可以查任何人的信息，用户可以查自己的信息
        //console.log(ctx.request.query.id);
        if (!is_number(ctx.request.query.id)) {
            ctx.body = invalidParameter();
        } else {
            let {id} = ctx.request.query;//取出请求的ID
            id = Number(id);
            const sessionID = (ctx.session.data as ISession).userID;//取出sessionID 判断一下是管理员或者是用户
            const res = await serverCheckSupervisorSession(sessionID);
            if (res.body.isSuccessful && res.body.data) {//是超管 可以查任意用户的信息
                const response = await queryUserInfo(id);
                if (response.body.data && response.body.isSuccessful) {
                    let {isSuccessful, message, data} = response.body;
                    data.password = "";
                    ctx.body = new ResponseBody(isSuccessful, message, data);
                } else {
                    let {isSuccessful, message} = response.body;
                    ctx.body = new ResponseBody(isSuccessful, message);
                }
            } else { //普通用户
                if (sessionID !== id) {
                    ctx.body = new ResponseBody<void>(false, 'invalidCall');
                } else { //查自己的信息
                    const response = await queryUserInfo(id);
                    if (response.body.isSuccessful && response.body.data) {
                        const {isSuccessful, message, data} = response.body;
                        data.password = '';
                        ctx.body = new ResponseBody(isSuccessful, message, data);
                    } else {
                        const {isSuccessful, message} = response.body;
                        ctx.body = new ResponseBody(isSuccessful, message);
                    }
                }
            }
        }
    });
    router.post('/api/modifyUserInfo', checkDvSupSession, async (ctx): Promise<void> => {//超管可以修改所有人，其他用户只能修改自己
        let userID = (ctx.session.data as ISession).userID;//session中取出发起请求用户id
        if (typeof ctx.request.body.ID !== 'number' || (typeof ctx.request.body.password !== 'string' && typeof ctx.request.body.password !== 'undefined') || (typeof ctx.request.body.telephone !== 'string' && typeof ctx.request.body.telephone !== 'undefined') || (typeof ctx.request.body.email !== 'string' && typeof ctx.request.body.email !== 'undefined')) {
            ctx.body = invalidParameter();
        } else {
            const {ID, password, telephone, email} = ctx.request.body;//请求体中id
            const checkSessRes = await serverCheckSupervisorSession(userID);
            const flag = checkSessRes.body.isSuccessful;
            if (flag) {//是超管
                const response = await modifyUserInfo(ID, password, telephone, email);
                const {isSuccessful, message, data} = response.body;
                ctx.body = new ResponseBody(isSuccessful, message, data);
            } else {//不是超管
                if (ID !== userID) {//如果此时访问的id与自己的sessionID不一致的话，那么就是非法请求
                    ctx.body = new ResponseBody(false, 'invalidStatusError');
                } else {//修改自己的信息
                    const response = await modifyUserInfo(userID, password, telephone, email);
                    const {isSuccessful, message, data} = response.body;
                    ctx.body = new ResponseBody(isSuccessful, message, data);
                }
            }
        }
    });
    router.get('/api/listUserInfo', checkSupervisorSession, async (ctx): Promise<void> => {
        if (!is_number(ctx.request.query.offset) || !is_number(ctx.request.query.limit)) {
            ctx.body = invalidParameter();
        } else {
            let {offset, limit} = ctx.request.query;
            offset = Number(offset);
            limit = Number(limit);
            const userID = (ctx.session.data as ISession).userID;
            const result = await listUserInfo(offset, limit, userID);
            const {isSuccessful, message, data} = result.body;
            ctx.body = new ResponseBody<UserInfo[]>(isSuccessful, message, data);
        }
    });
    router.get('/api/queryUserAmount', checkSupervisorSession, async (ctx) => {
        if (!checkType.instanceOfUserType(ctx.request.query.userType)) {
            ctx.body = invalidParameter();
        } else {
            const {userType} = ctx.request.query;
            const {userID} = ctx.session.data as ISession;
            const response = await queryUserAmount(userType, userID);
            const {isSuccessful, message, data} = response.body;
            ctx.body = new ResponseBody<number>(isSuccessful, message, data);
        }
    });


    router.get('/api/logout', async (ctx): Promise<void> => {
        ctx.session.data = null;
        ctx.session.text = null;
        ctx.body = new ResponseBody<void>(true, 'logoutSuccess');
    });


    router.get('/api/searchUser', checkSupervisorSession, async (ctx) => {
        if (typeof ctx.request.query.keyword !== "string") {
            ctx.body = invalidParameter();
        } else {
            const {keyword} = ctx.request.query;
            const {userID} = ctx.session.data as ISession;
            const response = await searchUserInfo(keyword, userID);
            if (response.body.isSuccessful && response.body.data) {
                const {isSuccessful, message, data} = response.body;
                ctx.body = new ResponseBody<UserInfo[]>(isSuccessful, message, data);
            } else {
                const {isSuccessful, message} = response.body;
                ctx.body = new ResponseBody<UserInfo[]>(isSuccessful, message);
            }
        }
    });
};




