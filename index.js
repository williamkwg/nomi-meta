/*
* meta middleware, should be the first middleware
*/
'use strict';

const defaultOption = {
    sendResponseTime: true,
    logRequset: true,
    requestTimeout: 10*1000, // request timeout 默认10s
    requestTimeoutCallback: ()=>{}
} 
 
export default function(options) {
    options = Object.assign({}, defaultOption, options);
    
    return async function meta(ctx, next) {
        // logging TODO: nomi logger使用
        if (options.logRequset) {
            ctx.coreLogger.logger('[meta] request started, host: %s, user-agent: %s',
                ctx.host, ctx.header['user-agent']);
        }

        // set request timeout
        ctx.response.setTimeout(options.requestTimeout, options.requestTimeoutCallback);
        
        let start =Date.now();
        await next();
        let end = Date.now();
        // total response time header TODO: nomi中ctx.set()方法，此处是设置response headers
        if (options.sendResponseTime) {
            ctx.set('x-readtime', `${end - start}ms`);
        }

        // try to support Keep-Alive Header TODO: server获取
        const server = ctx.app.server;
        if (server && server.keepAliveTimeout && server.keepAliveTimeout >= 1000 && ctx.header.connection !== 'close') {
            const timeout = parseInt(server.keepAliveTimeout / 1000);
            ctx.set('keep-alive', `timeout=${timeout}`);
        }
    }
}