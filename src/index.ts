import Koa from "koa"
import koaBody from "koa-body";
import * as path from "path";
import {router} from "./router";
import koaSession from "koa-session";
import serve from "koa-static";
import helmet from "koa-helmet";
import compress from "koa-compress";
import {logErr} from "./router/LogError";
import {maxFileSize} from "./config/maxFileSize";
import {rootDirPath} from "./config/filePaths";
//import {rateLimiterMiddleware} from "./router/rateLimiter";


const app = new Koa();
//import SessionConfig from "./config/SessionConfig";
//import koaBodyOptions from "./config/koaBodyConfig";


app.use(compress({
    filter(content_type) {
        return /text/i.test(content_type)
    },
    threshold: 1024, //bytes
    gzip: {
        flush: require('zlib').constants.Z_SYNC_FLUSH
    },
    deflate: {
        flush: require('zlib').constants.Z_SYNC_FLUSH,
    },
    br: false // disable brotli
}))

app.use(helmet());

app.use(koaBody({
    multipart: true,
    formidable: {
        uploadDir: path.join(rootDirPath, 'files', 'upload'),
        keepExtensions: true,
        maxFileSize: maxFileSize,// 设置上传文件大小最大限制
        hash: 'md5'
    }
}));

app.keys = ['secret key'];


app.use(koaSession({
    key: 'koa:sess',
    rolling: true,
    httpOnly: true
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

