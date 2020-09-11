import Router from 'koa-router';
import {UserLogin} from "../server/UserServer";
import {ResponseBody} from "../instances/ResponseBody";
import {invalidParameter} from "./invalidParameter";
import {IContext, IState} from "../interface/session";

module.exports = (router: Router<IState, IContext>) => {
    router.post('/api/userLogin', async (ctx): Promise<void> => {//普通用户和机器人管理员登陆
        //console.log(ctx.request);
        const {username, password} = ctx.request.body;
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
    });
}
