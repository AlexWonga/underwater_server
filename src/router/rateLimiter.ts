import redis from "redis";
import {RateLimiterRedis} from "rate-limiter-flexible";


const client = redis.createClient({
    host: 'redis',
    port: 6379,
    enable_offline_queue: false,
});

client.on("error", function (err) {
    console.log("Redis error encountered", err);
});

export const rateLimiter = new RateLimiterRedis({
    storeClient: client,
    keyPrefix: 'middleware',
    points: 10, // 10 requests for ctx.ip
    duration: 1, // per 1 second
});

