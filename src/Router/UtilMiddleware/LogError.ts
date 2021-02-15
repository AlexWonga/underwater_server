import {log4js} from "../../Instances/Logger";
import {ParameterizedContext} from "koa";


const logger = log4js.getLogger();
let requestToString = ((request: any) => {
    const {url, query, body, headers} = request;
    return `
      time: ${new Date()}
      url: ${url}
      header: ${JSON.stringify(headers)}
      query: ${JSON.stringify(query)}
      body: ${JSON.stringify(body)}  
    `;
});
let errToString = ((err: Error) => {
    return `
        time: ${new Date()}
        msg: ${err.message}
        err: ${err}
        stack:${err.stack}
    `;
});

export async function logErr(ctx: ParameterizedContext, next: Function) {
    try {
        //logger.info('Test');
        await next();
        if (ctx.status === 404) {
            logger.info('[404]', ctx.request.url);
        }
    } catch (err) {
        const errString = `
            ${requestToString(ctx.request)}
            ${errToString(err)}
        `;
        logger.error(errString);
        ctx.status = err.status || 500;
        ctx.body = err;
    }
}

