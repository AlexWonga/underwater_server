import {ResponseBody} from "../instances/ResponseBody";
import Router from 'koa-router';
import {UserType} from "../Enum/UserType";
import {queryUserInfo} from "../server/UserSupervisorServer";
import {IContext, IState} from "../interface/session";


interface sessionType {
    userID: number;
    username: string;
    userType: UserType
}

module.exports = (router: Router<IState, IContext>) => {
    router.get('/api/checkSessionExist', async (ctx) => {
        if (ctx.session === null || JSON.stringify(ctx.session) === '{}' || ctx.session.isNew) {
            ctx.body = new ResponseBody<sessionType>(false, 'invalidCall');
        } else {
            if (ctx.session.data) {
                const {username, userID} = ctx.session.data;
                console.log(username,userID);
                const user = await queryUserInfo(userID);
                if (user.body.data) {
                    const {userType} = user.body.data;
                    let result: sessionType = {userID, username,userType};
                    ctx.body = new ResponseBody<sessionType>(true, 'sessionExist', result);
                }else{
                    ctx.body = new ResponseBody<sessionType>(false,'userNotFound');
                }
            } else {
                ctx.body = new ResponseBody<sessionType>(false, 'noSessionData')
            }
        }
    });
}


