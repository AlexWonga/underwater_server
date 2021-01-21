// import redis from "redis";
import {RateLimiterMemory} from "rate-limiter-flexible";
import {ExtendableContext } from "koa";
// import {IContext, IState} from "../interface/session";


// export const client = redis.createClient({
//     host: 'localhost',
//     port: 6379,
//     enable_offline_queue: false,
// });

// client.on("error", function (err) {
//     console.log("Redis error encountered", err);
// });

const rateLimiter = new RateLimiterMemory({
    keyPrefix: 'middleware',
    points: 10,
    duration: 1,
    blockDuration: 60 * 60,
});

export async function rateLimiterMiddleware(ctx: ExtendableContext, next: Function): Promise<void> {
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



