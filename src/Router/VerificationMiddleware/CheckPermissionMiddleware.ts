import {checkSupervisorSession as serverCheckSupervisorSession} from "../../Server/VerificationFunction/CheckPermission";
import {ResponseBody} from "../../Instances/ResponseBody";
import {ParameterizedContext} from 'koa';
import {checkDvSupSession as checkDvSupSessionServer} from "../../Server/VerificationFunction/CheckPermission";
import {IContext, IState} from "../../Interface/Session";

export async function checkSupervisorSession(ctx: ParameterizedContext<IState, IContext>, next: Function): Promise<void> {
    if (ctx.session === null) {//先检测session是否为空
        ctx.body = new ResponseBody(false, 'invalidCall');
    } else {
        if (ctx.session.data) {
            const session = ctx.session.data;
            //console.log(session);
            const {userID} = session;
            const response = await serverCheckSupervisorSession(userID);
            const {isSuccessful, message} = response.body;
            if (isSuccessful) {//成功进入下一个中间件
                await next();
            } else {//返回错误信息
                ctx.body = new ResponseBody<void>(isSuccessful, message);
            }
        } else {
            ctx.body = new ResponseBody<void>(false, 'noSessionData');
        }
    }
}


/*export async function checkSession(ctx: ParameterizedContext<IState, IContext>, next: Function): Promise<void> {//查有没有session不查权限
    if (ctx.session === null) {//先检测session是否为空
        ctx.body = new ResponseBody(false, 'invalidCall');
    } else {
        if (ctx.session.data) {
            //console.log(session);
            await next();
        } else {
            ctx.body = new ResponseBody<void>(false, 'noSessionData');
        }
    }
}*/

export async function checkDvSupSession(ctx: ParameterizedContext<IState, IContext>, next: Function): Promise<void> {//查超管和机器人管理员session 普通用户不可以
    if (ctx.session === null) {//先检测session是否为空
        ctx.body = new ResponseBody<void>(false, 'invalidCall');
    } else {
        if (ctx.session.data) {//检查session信息
            const {userID} = ctx.session.data;
            const res = await checkDvSupSessionServer(userID);
            const {isSuccessful, message} = res.body;
            if (isSuccessful) {
                await next();
            } else {
                ctx.body = new ResponseBody<void>(isSuccessful, message);
            }
        } else {
            ctx.body = new ResponseBody<void>(false, 'noSessionData');
        }
    }
}

export async function checkSessionText(ctx: ParameterizedContext<IState, IContext>, next: Function): Promise<void> {//检查是否存在session 以及 session中是否含有text
    if (ctx.session === null || !ctx.session.text || ctx.session.isNew) {//先检测session是否为空
        ctx.body = new ResponseBody(false, 'invalidCall');
    } else {
        await next();
    }
}