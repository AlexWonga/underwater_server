import * as log4js from 'log4js';
import * as path from 'path';

log4js.configure({
    // 输出到控制台的内容，同时也输出到日志文件中
    appenders: {
        out: {
            type: 'stdout',
        },
        everything: {
            type: 'dateFile',
            filename: path.resolve('..','..', 'logs', 'server'),
            pattern: "-yyyy-MM-dd.log",
            alwaysIncludePattern: true,
        }
    },
    categories: {
        default: {
            appenders: ['out', 'everything'],
            level: 'all',
        },
        server: {
            //appenders:['out','everything'],
            appenders: ['everything'],
            level: 'all',
        }
    },
});

export {log4js};
