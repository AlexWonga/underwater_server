import {ResponseBody} from "../instances/ResponseBody";
import Router from 'koa-router';

import {queryUserInfo} from "../server/UserSupervisorServer";
import {IContext, IState} from "../interface/session";


module.exports = (router: Router<IState, IContext>) => {
    router.get('/api/checkSessionExist', async (ctx) => {
        if (ctx.session === null || JSON.stringify(ctx.session) === '{}') {
            ctx.body = new ResponseBody(false, 'invalidCall');
        } else {
            if (ctx.session.data) {
                const {username, userID} = ctx.session.data;
                console.log(username,userID);
                const user = await queryUserInfo(userID);
                if (user.body.data) {
                    const {userType} = user.body.data;
                    let result =  {userID:userID, username:username,userType:userType};
                    ctx.body = new ResponseBody(true, 'sessionExist', result);
                }else{
                    ctx.body = new ResponseBody(false,'userNotFound');
                }
            } else {
                ctx.body = new ResponseBody(false, 'noSessionData')
            }
        }
    });
}


