import {ResponseBody} from "../Instances/ResponseBody";
import {
    queryBannerPicture,
    queryRelatedLinks,
    querySlidePictures,
    queryPlatformOverview,
    queryFooter,
    queryContactUs
} from "../Server/GetSiteSettingServer";
import Router from 'koa-router'
import {IContext, IState} from "../Interface/Session";
import {utilx} from "../Instances/Utilx";


module.exports = (router: Router<IState, IContext>) => {
    router.get('/api/queryBannerPicture', async (ctx): Promise<void> => {//请求首页banner
        const response = await queryBannerPicture();
        if(response.body.data&&response.body.isSuccessful) {
            let {isSuccessful, message, data} = response.body;
            // data = utilx.absoluteToNetwork(data);
            // console.log(data);
            data = utilx.siteSettingToNetwork(data);
            ctx.body = new ResponseBody(isSuccessful, message, data);
        } else {
            const {isSuccessful, message} = response.body;
            ctx.body = new ResponseBody(isSuccessful, message);
        }
    });

    router.get('/api/queryFooter', async (ctx): Promise<void> => {//请求首页footer
        const response = await queryFooter();
        const {isSuccessful, message, data} = response.body;
        ctx.body = new ResponseBody(isSuccessful, message, data);
    });

    router.get('/api/queryContactUs', async (ctx): Promise<void> => {//请求联系我们
        const response = await queryContactUs();
        const {isSuccessful, message, data} = response.body;
        ctx.body = new ResponseBody(isSuccessful, message, data);
    });

    router.get('/api/querySlidePicture', async (ctx): Promise<void> => {//请求轮播图
        const response = await querySlidePictures();
        if(response.body.data && response.body.isSuccessful) {
            let {isSuccessful, message, data} = response.body;
            data.forEach((item)=>{
                // item.slidePath = utilx.absoluteToNetwork(item.slidePath);
                item.slidePath = utilx.siteSettingToNetwork(item.slidePath);
            });
            ctx.body = new ResponseBody(isSuccessful, message, data);
        } else {
            const {isSuccessful, message} = response.body;
            ctx.body = new ResponseBody(isSuccessful, message);
        }
    });

    router.get('/api/queryPlatformOverview', async (ctx): Promise<void> => {//请求平台概况
        const response = await queryPlatformOverview();
        const {isSuccessful, message, data} = response.body;
        ctx.body = new ResponseBody(isSuccessful, message, data);
    });

    router.get('/api/queryRelatedLink', async (ctx): Promise<void> => {//请求相关链接
        const response = await queryRelatedLinks();
        const {isSuccessful, message, data} = response.body;
        ctx.body = new ResponseBody(isSuccessful, message, data);
    });
};
