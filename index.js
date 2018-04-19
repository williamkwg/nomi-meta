/*
* meta middleware, should be the first middleware
*/
'use strict';

module.exports = function (options) {
    options = options || {};
    return async function meta(ctx, next) {
        // logging
        if (options.logging) {
            console.log('[meta] request started, host: %s, user-agent: %s',
                ctx.host, ctx.header['user-agent']);
        }
        
        let start =Date.now();
        await next();
        let end = Date.now();
        // total response time header 
        ctx.set('X-Response-Time', `${end - start}ms`);
        if (options.logRequset) {
            console.log(`${ctx.method} ${ctx.url} ${ctx.status} ${end - start}ms`);
        }
    }
}