"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
const mocha_typescript_1 = require("mocha-typescript");
const should = require('should');
const index_1 = require("./cont-test/index");
const index_2 = require("../src/index");
let ConfigLoaderTest = class ConfigLoaderTest {
    asserts_default() {
        let config = index_1.GlobalConfig.databaseConfig;
        should(config.get('address')).equal('http://admin:test@prod.test-server:1337');
        should(config.get('someOther')).equal('I am the default');
    }
    asserts_dev() {
        let config;
        process.env['NODE_ENV'] = 'development';
        index_1.ServerConfig.destroyInstance();
        config = index_1.ServerConfig.getInstance().databaseConfig;
        should(config.get('address')).equal('http://admin:@develop.test-server:1337');
    }
    asserts_prod() {
        let config;
        process.env['environment'] = 'production';
        index_1.ServerConfig.destroyInstance();
        config = index_1.ServerConfig.getInstance().databaseConfig;
        should(config.get('address')).equal('http://admin:test@prod.test-server:1337');
    }
    asserts_stage() {
        let config;
        process.env['environment'] = index_2.ConfigEnv.Staging;
        index_1.ServerConfig.destroyInstance();
        config = index_1.ServerConfig.getInstance().databaseConfig;
        should(config.get('address', 'not found')).equal('http://admin:test@staging.test-server:1337');
    }
    asserts_json() {
        let config;
        process.env['environment'] = index_2.ConfigEnv.Staging;
        process.env['json'] = '1';
        index_1.ServerConfig.destroyInstance();
        config = index_1.ServerConfig.getInstance().something;
        should(config.get('test', 'not found')).equal('hallo world');
    }
};
__decorate([
    mocha_typescript_1.test("should load default config if no env was set")
], ConfigLoaderTest.prototype, "asserts_default", null);
__decorate([
    mocha_typescript_1.test("should load value from develop config")
], ConfigLoaderTest.prototype, "asserts_dev", null);
__decorate([
    mocha_typescript_1.test("should load value from production config")
], ConfigLoaderTest.prototype, "asserts_prod", null);
__decorate([
    mocha_typescript_1.test("should load value from staging config")
], ConfigLoaderTest.prototype, "asserts_stage", null);
__decorate([
    mocha_typescript_1.test("should load value from staging config")
], ConfigLoaderTest.prototype, "asserts_json", null);
ConfigLoaderTest = __decorate([
    mocha_typescript_1.suite("ConfigLoaderTest")
], ConfigLoaderTest);
//# sourceMappingURL=test.js.map