import {ResponseBody} from "../instances/ResponseBody";
import Router from 'koa-router';
import {invalidParameter} from "./invalidParameter";
import {
    addSlidePicture,
    modifyBannerPicture,
    modifyPlatformOverview,
    modifyFooter,
    modifyRelatedLinks,
    modifyContactUs,
    deleteSlidePicture,
} from "../server/PostSiteSettingServer";
import {utilx} from "../instances/utilx";
import {checkSupervisorSession} from "./checkPermissionMiddleware";
import {ResponseServer} from "../instances/responseServer";
import {IContext, IState} from "../interface/session";



module.exports = (router: Router<IContext, IState>) => {
    router.post('/api/modifyBannerPicture', checkSupervisorSession, async (ctx): Promise<void> => {
        if (ctx.request.files !== undefined) {
            const picture = ctx.request.files.BannerPicture;//获取bannerPicture,一次上传一个
            if (Array.isArray(picture)) {//检查文件数量
                ctx.body = invalidParameter();
            } else {
                const flag: boolean = utilx.checkPicture(picture);
                if (!flag) {//判断是不是图片
                    ctx.body = invalidParameter();
                } else {
                    const response = await modifyBannerPicture(picture);//服务层修改banner图片
                    const {isSuccessful, message} = response.body;
                    ctx.body = new ResponseBody<void>(isSuccessful, message);
                }
            }
        }
    });
    router.post('/api/modifyFooter', checkSupervisorSession, async (ctx): Promise<void> => {
        if (typeof (ctx.request.body.footer) !== 'string') {
            ctx.body = invalidParameter();
        } else {
            let {footer} = ctx.request.body;
            let [clearedFooter] = utilx.clear(footer);
            footer = clearedFooter;
            const response: ResponseServer<void> = await modifyFooter(footer);
            const {isSuccessful, message} = response.body;
            ctx.body = new ResponseBody(isSuccessful, message);
        }
    });
    router.post('/api/modifyPlatformOverview', checkSupervisorSession, async (ctx): Promise<void> => {
        let {Article} = ctx.request.body;
        const [article] = utilx.clear(Article);
        if (typeof (article) !== 'string') {
            ctx.body = invalidParameter();
        } else {
            const response: ResponseServer<void> = await modifyPlatformOverview(article);
            const {isSuccessful, message} = response.body;
            ctx.body = new ResponseBody(isSuccessful, message);
        }
    });
    router.post('/api/addSlidesPicture', checkSupervisorSession, async (ctx): Promise<void> => {
        if (!ctx.request.files || typeof ctx.request.body.pictureDescription !== 'string') {//检查文件数量
            ctx.body = invalidParameter();
        } else {
            const {file} = ctx.request.files;
            if (Array.isArray(file)) {
                ctx.body = invalidParameter();
            } else {
                const {pictureDescription} = ctx.request.body;
                const flag: boolean = utilx.checkPicture(file);
                if (!flag) {//判断是不是图片
                    ctx.body = invalidParameter();
                } else {
                    const response: ResponseServer<void> = await addSlidePicture(file, pictureDescription);
                    const {isSuccessful, message} = response.body;
                    ctx.body = new ResponseBody(isSuccessful, message);
                }
            }
        }
    });
    router.post('/api/modifyContactUs', checkSupervisorSession, async (ctx): Promise<void> => {
        const {ContactUs} = ctx.request.body;
        if (typeof (ContactUs.contactWay) !== 'string' || typeof ContactUs.siteProfile !== 'string') {
            ctx.body = invalidParameter();
        } else {
            const response: ResponseServer<void> = await modifyContactUs(ContactUs);
            const {isSuccessful, message} = response.body;
            ctx.body = new ResponseBody(isSuccessful, message);
        }
    });
    router.post('/api/modifyRelatedLinks', checkSupervisorSession, async (ctx): Promise<void> => {
        const {RelatedLinks} = ctx.request.body;
        for (let i = 0; i < (RelatedLinks.length); i++) {//参数检测
            if (typeof (RelatedLinks[i].link) !== 'string' || typeof (RelatedLinks[i].linkName!) !== 'string' ||
                typeof (RelatedLinks[i].sequence) !== 'number') {
                ctx.body = invalidParameter();
            }
        }
        const response: ResponseServer<void> = await modifyRelatedLinks(RelatedLinks);
        const {isSuccessful, message} = response.body;
        ctx.body = new ResponseBody(isSuccessful, message);
    });
    router.post('/api/deleteSlidePicture', checkSupervisorSession, async (ctx): Promise<void> => {
        const {slidePictureID} = ctx.request.body;
        if (typeof (slidePictureID) !== 'number') {
            ctx.body = invalidParameter();
        } else {
            const response: ResponseServer<void> = await deleteSlidePicture(slidePictureID);
            const {isSuccessful, message} = response.body;
            ctx.body = new ResponseBody(isSuccessful, message);
        }
    });
}

