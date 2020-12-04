import Router from 'koa-router';
import {UserLogin} from "../server/UserServer";
import {ResponseBody} from "../instances/ResponseBody";
import {invalidParameter} from "./invalidParameter";
import {IContext, IState} from "../interface/session";
import {checkSessionText} from "./checkPermissionMiddleware";
import svgCaptcha from "svg-captcha";


module.exports = (router: Router<IState, IContext>) => {
    router.post('/api/userLogin', checkSessionText, async (ctx): Promise<void> => {//普通用户和机器人管理员登陆
        if (typeof (ctx.request.body.username) !== "string" || typeof (ctx.request.body.password) !== "string" || typeof (ctx.request.body.code) !== "string") {//检查参数类型 code是图形验证码的答案
            ctx.body = invalidParameter();
        } else {
            let {username, password, code} = ctx.request.body;//从请求中取出用户名与密码
            const text = ctx.session.text;
            if (text === null || text.toLowerCase() !== code.toString().toLowerCase()) {
                ctx.body = new ResponseBody<void>(false, 'wrongVerificationCode');
            } else {
                const response = await UserLogin(username, password);//服务层返回的response
                if (response.session) {//如果session不为空 就设置session
                    ctx.session.data = response.session;
                }
                const {isSuccessful, message} = response.body;
                if (!isSuccessful && message === "wrongPassword") {
                    let captcha = svgCaptcha.create();
                    const text = captcha.text;
                    const svgData = captcha.data;
                    ctx.session.text = text;
                    ctx.body = new ResponseBody<string>(isSuccessful, message, svgData);
                } else {
                    ctx.body = new ResponseBody<void>(isSuccessful, message);
                }
            }
        }
    });
}
