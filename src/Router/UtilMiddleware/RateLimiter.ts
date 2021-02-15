// import redis from "redis";
import {RateLimiterMemory} from "rate-limiter-flexible";
import {ParameterizedContext} from "koa";
import {IContext, IState} from "../../Interface/Session";


// export const client = redis.createClient({
//     host: 'localhost',
//     port: 6379,
//     enable_offline_queue: false,
// });

// client.on("error", function (err) {
//     console.log("Redis error encountered", err);
// });
//用来限制请求次数
const rateLimiter = new RateLimiterMemory({
    keyPrefix: 'middleware',
    points: 10,
    duration: 1,
    blockDuration: 60 * 60,
});

export async function rateLimiterMiddleware(ctx: ParameterizedContext<IState, IContext>, next: Function): Promise<void> {
    try {
        await rateLimiter.consume(ctx.ip);
        await next();
    } catch (rejRes) {
        ctx.status = 429;
        ctx.body = 'Too Many Requests';
        // Or you can throw an exception
        // ctx.throw(429, 'Too Many Requests')
    }
}



