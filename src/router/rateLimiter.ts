import redis from "redis";
import {RateLimiterRedis} from "rate-limiter-flexible";
import {ParameterizedContext} from "koa";
import {IContext, IState} from "../interface/session";


export const client = redis.createClient({
    host: 'localhost',
    port: 6379,
    enable_offline_queue: false,
});

client.on("error", function (err) {
    console.log("Redis error encountered", err);
});

const rateLimiter = new RateLimiterRedis({
    storeClient: client,
    keyPrefix: 'middleware',
    points: 100, // 10 requests for ctx.ip
    duration: 1, // per 1 second
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



