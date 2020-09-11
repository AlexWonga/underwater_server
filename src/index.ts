import Koa from "koa"
import koaBody from "koa-body";
import * as path from "path";
import {router} from "./router";
import koaSession from "koa-session";
import serve from "koa-static";
import {logErr} from "./router/LogError";
import {maxFileSize} from "./instances/maxFileSize";
import {rootDirPath} from "./config/filePaths";
//import {rateLimiterMiddleware} from "./router/rateLimiter";

const app = new Koa();
//import SessionConfig from "./config/SessionConfig";
//import koaBodyOptions from "./config/koaBodyConfig";

app.use(koaBody({
    multipart: true,
    formidable: {
        uploadDir: path.join(rootDirPath,'files','upload'),
        keepExtensions: true,
        maxFileSize: maxFileSize,// 设置上传文件大小最大限制
        hash:'md5'
    }
}));

app.keys = ['secret key'];


app.use(koaSession({
    key: 'koa:sess',
    renew: true,
    rolling: false,
}, app));

const staticPath = 'files';

app.use(serve(
    path.join(rootDirPath, staticPath)
));

app.use(logErr);
//app.use(rateLimiterMiddleware);
app.use(router.routes());
app.use(router.allowedMethods());


export default app.listen(8000, function () {
    console.log('server is running in port 8000');
});

