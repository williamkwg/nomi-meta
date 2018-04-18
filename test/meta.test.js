/**!
 * nomi-meta - test/middleware.test.js
 */

 "use strict";

 /** 
  * Module dependencies
 */
const assert = require('assert');
const meta = require('../');
const sinon = require('sinon');
const Koa = require('koa');
const request = require('supertest');

let sandbox,log,app;
describe('meta', ()=>{
    describe('default config',async ()=> {
        beforeEach(()=> {
            app =App();
        })
        
        it('should get X-Response-Time header', () => {
            return request(app.listen())
                .get('/')
                .expect('X-Response-Time', /\d+/)
                //.expect(200);
        });
    });

    describe('meta.logging = true', ()=> {
        app = App({logging: true});

        beforeEach(function () {
            sandbox = sinon.sandbox.create()
            log = sandbox.spy(console, 'log')
        });

        afterEach(function () {
            sandbox.restore()
        });

        it('should log a request start', () => {
            return request(app.listen())
                .get('/')
                
                .expect(404, ()=> {
                    expect(log).to.have.been.calledWith('[meta] request started, host: %s, user-agent: %s',
                        ctx.host,ctx.header['user-agent'])
                });
        });
    });

    describe('meta.logRequest = true', () => {
        app = App({ logRequest: true });

        beforeEach(function () {
            sandbox = sinon.sandbox.create()
            log = sandbox.spy(console, 'log')
        });

        afterEach(function () {
            sandbox.restore()
        });

        it('should log a request', () => {
            return request(app.listen())
                .get('/')
               
                .expect(404, () => {
                    expect(log).to.have.been.
                        calledWith(`${ctx.method} ${ctx.url} ${ctx.status} ${endTime - startTime}ms`)
                });
        });
    });

    describe('cluster start', () => {
        app = App();
        it('should ignore keep-alive header when request is not keep-alive', () => {
            return request(app.listen())
                .get('/')
                
                .expect(res => assert(!res.headers['keep-alive']))
                //.expect(200);
        });
        it('should get keep-alive header when request is keep-alive', () => {
            return request(app.listen())
                .get('/')
                .set('connection', 'keep-alive')
                 
                .expect('keep-alive', 'timeout=5')
            //.expect(200);
        }); 
    });

});

function App(options) {
    const app = new Koa();
    app.use(meta(options));
    return app;
}