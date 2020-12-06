import Router from 'koa-router';
import {userLogin} from "../server/UserServer";
import {ResponseBody} from "../instances/ResponseBody";
import {invalidParameter} from "./invalidParameter";
import {IContext, IState} from "../interface/session";
import {checkSessionText} from "./checkPermissionMiddleware";

import {rateLimiterMiddleware} from "./rateLimiter";
import svgCaptcha from "svg-captcha";


module.exports = (router: Router<IState, IContext>) => {
    router.post('/api/userLogin', rateLimiterMiddleware, checkSessionText, async (ctx): Promise<void> => {//普通用户和机器人管理员登陆
        if (typeof (ctx.request.body.username) !== "string" || typeof (ctx.request.body.password) !== "string" || typeof (ctx.request.body.code) !== "string") {//检查参数类型 code是图形验证码的答案
            ctx.body = invalidParameter();
        } else {
            let {username, password, code} = ctx.request.body;//从请求中取出用户名与密码
            const text = ctx.session!.text;
            if (text === null || text.toLowerCase() !== code.toString().toLowerCase()) {
                const svgData = svgCaptcha.create();
                ctx.session!.text = svgData.text;
                ctx.body = new ResponseBody<string>(false, 'wrongVerificationCode', svgData.data);
            } else {
                const response = await userLogin(username, password);//服务层返回的response
                const {isSuccessful, message} = response.body;
                if (!isSuccessful) {
                    const svgData = svgCaptcha.create();
                    ctx.session!.text = svgData.text;
                    ctx.body = new ResponseBody<string>(isSuccessful, message, svgData.data);
                } else {
                    ctx.session!.text = null;
                    if (response.session !== undefined) {//如果session不为空 就设置session
                        ctx.session!.data = response.session;
                    }
                    ctx.body = new ResponseBody<void>(isSuccessful, message);
                }
            }
        }
    });
}
