import Router from "koa-router";
import {Article} from "../Class/Article";
import {checkDvSupSession, checkSupervisorSession} from "./checkPermissionMiddleware";
import {ResponseBody} from "../instances/ResponseBody";
import {checkType} from "../instances/checkType";
import {invalidParameter} from "./invalidParameter";
import is_number from "is-number";
import {
    addArticle,
    deleteArticle,
    modifyArticle,
    deletedArticleRecover,
    queryArticleAmount,
    listArticleInfo,
    listDeletedArticleInfo,
    searchArticleInfo,
    searchDeletedArticleInfo,
    queryArticleInfo,
    queryArticleAmountOnID,
    listArticleOnID,
    queryDeletedArticleAmount, searchArticleInfoOnID
} from "../server/ArticleServer";
import {IContext, ISession, IState} from "../interface/session";
import {utilx} from "../instances/utilx";


module.exports = (router: Router<IState, IContext>) => {

    router.post('/api/addArticle', checkDvSupSession, async (ctx): Promise<void> => {
        if (typeof ctx.request.body.title !== 'string' || typeof ctx.request.body.content !== 'string' || !checkType.instancesOfArticleType(ctx.request.body.articleType)) {//检查参数类型
            ctx.body = invalidParameter();
        } else {
            let {title, articleType, content} = ctx.request.body;
            const [clearedTitle, clearedContent] = utilx.clear(title, content);
            title = clearedTitle;
            content = clearedContent;
            const authorID = (ctx.session.data as ISession).userID;
            const response = await addArticle(title, articleType, content, authorID);
            const {isSuccessful, message} = response.body;
            ctx.body = new ResponseBody<void>(isSuccessful, message);
        }
    });

    router.post('/api/modifyArticleInfo', checkDvSupSession, async (ctx): Promise<void> => {//超管可以改任何人的文章，其他人只能改自己
        const sessionUserID = (ctx.session.data as ISession).userID;
        if (checkType.instancesOfArticleType(ctx.request.body.articleInfo)) {
            ctx.body = invalidParameter();
        } else {
            let {articleID, title, content} = ctx.request.body.articleInfo;
            const [clearedTitle, clearedContent] = utilx.clear(title, content);
            title = clearedTitle;
            content = clearedContent;
            const response = await modifyArticle(articleID, sessionUserID, title, content);
            const {isSuccessful, message} = response.body;
            ctx.body = new ResponseBody<void>(isSuccessful, message);
        }
    });

    router.post('/api/deleteArticle', checkDvSupSession, async (ctx): Promise<void> => {
        if (typeof ctx.request.body.articleID !== 'number') {
            ctx.body = new ResponseBody(false, 'invalidParameter');
        } else {
            const {articleID} = ctx.request.body;
            const {userID} = ctx.session.data as ISession;
            const res = await deleteArticle(articleID, userID);
            const {isSuccessful, message} = res.body;
            ctx.body = new ResponseBody<void>(isSuccessful, message);
        }
    });
    router.post('/api/deletedArticleRecover', checkSupervisorSession, async (ctx): Promise<void> => {
        if (typeof ctx.request.body.articleID !== 'number') {
            ctx.body = invalidParameter();
        } else {
            const {articleID} = ctx.request.body;
            const {userID} = ctx.session.data as ISession;
            const response = await deletedArticleRecover(articleID, userID);
            const {isSuccessful, message} = response.body;
            ctx.body = new ResponseBody<void>(isSuccessful, message);
        }
    });

    router.get('/api/queryArticleAmount', async (ctx): Promise<void> => {
        if (!checkType.instancesOfArticleType(ctx.request.query.articleType)) {
            ctx.body = invalidParameter();
        } else {
            const {articleType} = ctx.request.query;
            const response = await queryArticleAmount(articleType);
            if (response.body.isSuccessful && response.body.data) {
                const {isSuccessful, message, data} = response.body;
                ctx.body = new ResponseBody<number>(isSuccessful, message, data);
            } else {
                const {isSuccessful, message} = response.body;
                ctx.body = new ResponseBody<number>(isSuccessful, message);
            }
        }
    });

    router.get('/api/listArticleInfo', async (ctx) => {
        if (!is_number(ctx.request.query.offset) || !is_number(ctx.request.query.limit) || !checkType.instancesOfArticleType(ctx.request.query.articleType)) {
            ctx.body = invalidParameter();
        } else {
            let {offset, limit, articleType} = ctx.request.query;
            offset = Number(offset);
            limit = Number(limit);
            const response = await listArticleInfo(articleType, offset, limit);
            if (response.body.isSuccessful && response.body.data) {
                let {isSuccessful, message, data} = response.body;
                ctx.body = new ResponseBody<Article[]>(isSuccessful, message, data);
            } else {
                const {isSuccessful, message} = response.body;
                ctx.body = new ResponseBody<Article[]>(isSuccessful, message);
            }
        }
    });

    router.get('/api/listDeletedArticleInfo', checkSupervisorSession, async (ctx) => {
        if (!is_number(ctx.request.query.offset) || !is_number(ctx.request.query.limit) || !checkType.instancesOfArticleType(ctx.request.query.articleType)) {
            ctx.body = invalidParameter();
        } else {
            const {userID} = (ctx.session.data) as ISession;
            let {offset, limit, articleType} = ctx.request.query;
            offset = Number(offset);
            limit = Number(limit);
            const response = await listDeletedArticleInfo(articleType, offset, limit, userID);
            if (response.body.isSuccessful && response.body.data) {
                const {isSuccessful, message, data} = response.body;
                ctx.body = new ResponseBody<Article[]>(isSuccessful, message, data);
            } else {
                const {isSuccessful, message} = response.body;
                ctx.body = new ResponseBody<Article[]>(isSuccessful, message);
            }
        }
    });

    router.get('/api/searchArticleInfo', async (ctx) => {
        //todo:限制请求频率
        if (typeof ctx.request.query.keyword !== 'string' || !checkType.instancesOfArticleType(ctx.request.query.articleType)) {
            ctx.body = invalidParameter();
        } else {
            const {keyword, articleType} = ctx.request.query;
            const response = await searchArticleInfo(keyword, articleType);
            if (response.body.data && response.body.isSuccessful) {
                const {isSuccessful, message, data} = response.body;
                ctx.body = new ResponseBody<Article[]>(isSuccessful, message, data);
            } else {
                const {isSuccessful, message} = response.body;
                ctx.body = new ResponseBody<Article[]>(isSuccessful, message);
            }
        }
    });

    router.get('/api/searchArticleInfo', checkSupervisorSession, async (ctx) => {

        if (typeof ctx.request.query.keyword !== 'string' || !checkType.instancesOfArticleType(ctx.request.query.articleType)) {
            ctx.body = invalidParameter();
        } else {
            const {keyword, articleType} = ctx.request.query;
            const {userID} = ctx.session.data as ISession
            const response = await searchDeletedArticleInfo(keyword, userID, articleType);
            if (response.body.data && response.body.isSuccessful) {
                const {isSuccessful, message, data} = response.body;
                ctx.body = new ResponseBody<Article[]>(isSuccessful, message, data);
            } else {
                const {isSuccessful, message} = response.body;
                ctx.body = new ResponseBody<Article[]>(isSuccessful, message);
            }
        }
    });

    router.get('/api/queryArticleInfo', async (ctx) => {
        if (!is_number(ctx.request.query.articleID)) {
            ctx.body = new ResponseBody<Article>(false, 'invalidParameter');
        } else {
            let {articleID} = ctx.request.query;
            articleID = Number(articleID);
            const response = await queryArticleInfo(articleID);
            if (response.body.isSuccessful && response.body.data) {
                let {isSuccessful, message, data} = response.body;
                const [content] = utilx.clear(data.content);
                data.content = content;
                ctx.body = new ResponseBody<Article>(isSuccessful, message, data);
            } else {
                const {isSuccessful, message} = response.body;
                ctx.body = new ResponseBody<Article>(isSuccessful, message);
            }
        }
    });

    router.get('/api/queryArticleAmountOnID', async (ctx) => {
        if (!is_number(ctx.request.query.userID) || !checkType.instancesOfArticleType(ctx.request.query.articleType)) {
            ctx.body = invalidParameter();
        } else {
            let {userID, articleType} = ctx.request.query;
            const response = await queryArticleAmountOnID(articleType, userID);
            if (response.body.isSuccessful && response.body.data) {
                const {isSuccessful, message, data} = response.body;
                ctx.body = new ResponseBody<number>(isSuccessful, message, data);
            } else {
                const {isSuccessful, message} = response.body;
                ctx.body = new ResponseBody<number>(isSuccessful, message);
            }
        }
    });

    router.get('/api/listArticleOnID', checkDvSupSession, async (ctx) => {
        if (!checkType.instancesOfArticleType(ctx.request.query.articleType) || !is_number(ctx.request.query.offset) || !is_number(ctx.request.query.limit) || !is_number(ctx.request.query.userID)) {
            ctx.body = invalidParameter();
        } else {
            let {articleType, offset, limit, userID} = ctx.request.query;
            offset = Number(offset);
            limit = Number(limit);
            userID = Number(userID);
            const sessionUserID = (ctx.session.data as ISession).userID;
            const response = await listArticleOnID(articleType, offset, limit, userID, sessionUserID);
            if (response.body.data && response.body.isSuccessful) {
                const {isSuccessful, message, data} = response.body;
                ctx.body = new ResponseBody<Article[]>(isSuccessful, message, data);
            } else {
                const {isSuccessful, message} = response.body;
                ctx.body = new ResponseBody<Article[]>(isSuccessful, message);
            }
        }
    })
    router.get('/api/queryDeletedArticleAmount', checkSupervisorSession, async (ctx) => {
        if (!checkType.instancesOfArticleType(ctx.request.query.articleType)) {
            ctx.body = invalidParameter();
        } else {
            const {articleType} = ctx.request.query;
            const {userID} = ctx.session.data as ISession;
            const response = await queryDeletedArticleAmount(articleType, userID);
            if (response.body.isSuccessful && response.body.data) {
                const {isSuccessful, message, data} = response.body;
                ctx.body = new ResponseBody<number>(isSuccessful, message, data);
            } else {
                const {isSuccessful, message} = response.body;
                ctx.body = new ResponseBody<number>(isSuccessful, message);
            }
        }
    });

    router.get('/api/searchArticleInfoOnID', checkDvSupSession, async (ctx) => {

        if (typeof ctx.request.query.keyword !== 'string' || !checkType.instancesOfArticleType(ctx.request.query.articleType)) {
            ctx.body = invalidParameter();
        } else {
            const {keyword, articleType} = ctx.request.query;
            const {userID} = ctx.session.data as ISession
            const response = await searchArticleInfoOnID(keyword, articleType, userID);
            if (response.body.data && response.body.isSuccessful) {
                const {isSuccessful, message, data} = response.body;
                ctx.body = new ResponseBody<Article[]>(isSuccessful, message, data);
            } else {
                const {isSuccessful, message} = response.body;
                ctx.body = new ResponseBody<Article[]>(isSuccessful, message);
            }
        }
    });
}

