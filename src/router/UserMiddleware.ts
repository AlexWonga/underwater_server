import Router from 'koa-router';
import {UserLogin} from "../server/UserServer";
import {ResponseBody} from "../instances/ResponseBody";
import {invalidParameter} from "./invalidParameter";
import {IContext, IState} from "../interface/session";
import {checkSessionText} from "./checkPermissionMiddleware";

module.exports = (router: Router<IState, IContext>) => {
    router.post('/api/userLogin', checkSessionText, async (ctx): Promise<void> => {//普通用户和机器人管理员登陆
        //console.log(ctx.request);
        if (typeof (ctx.request.body.username) !== "string" || typeof (ctx.request.body.password) !== "string" || typeof (ctx.request.body.code) !== "string") {//检查参数类型
            ctx.body = invalidParameter();
        } else {
            const {username, password, code} = ctx.request.body;
            const text = ctx.session.text;
            if (text !== code) {
                ctx.body = new ResponseBody<void>(false, 'wrongVerificationCode');
            }
            if (typeof username !== 'string' || typeof password !== 'string') {
                ctx.body = invalidParameter();
            } else {
                const response = await UserLogin(username, password);
                const {isSuccessful, message} = response.body;
                if (response.session) {
                    ctx.session.data = response.session;//设置session
                }
                ctx.body = new ResponseBody<void>(isSuccessful, message);
            }
        }
    });
}
