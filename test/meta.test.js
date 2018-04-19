/**
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
    describe('default config', ()=> {
        beforeEach(()=> {
            sandbox = sinon.sandbox.create()
            log = sandbox.spy(console, 'log')

            app = App();
        });
        afterEach(function () {
            sandbox.restore()
        });

        it('should get X-Response-Time header', () => {
            return request(app.listen())
                .get('/')
                .expect('X-Response-Time', /\d+/)
                .expect(()=> {
                    assert(log.notCalled)
                });
            });
        });
    

    describe('meta.logging = true', ()=> {
        beforeEach(function () {
            sandbox = sinon.sandbox.create()
            log = sandbox.spy(console, 'log')
            app = App({logging: true});
        });

        afterEach(function () {
            sandbox.restore()
        });

        it('should log a request start', () => {
            return request(app.listen())
                .get('/')
                .expect('X-Response-Time', /\d+/)
                .expect( ()=> {
                    assert(log.called);
                });
        });
    });

    describe('meta.logRequset = true', () => {
        beforeEach(function () {
            sandbox = sinon.sandbox.create()
            log = sandbox.spy(console, 'log')
            app = App({ logRequset: true });
        });

        afterEach(function () {
            sandbox.restore()
        });

        it('should log a request', () => {
            return request(app.listen())
                .get('/200')
                .expect('X-Response-Time', /\d+/)
                .expect(()=> {
                    assert(log.called);
                });
                
               
        });

        it('should log a request with err', () => {
            return request(app.listen())
                .get('/')
                .expect('X-Response-Time', /\d+/)
                .expect(() => {
                    assert(log.notCalled);
                }); 
        });
    });
});

function App(options) {
    const app = new Koa();
    app.use(meta(options));
    return app;
}