import { suite, test } from "mocha-typescript";
import * as should from 'should';
import {GlobalConfig, ServerConfig} from "./cont-test/index";
import {ConfigEnv} from "../src/index";


@suite("ConfigLoaderTest")
class ConfigLoaderTest {

    // NOTE: please check the files in test/conf-test to understand what we do here

    @test("should load default config if no env was set")
    asserts_default() {
        // if no env was set or the setting / config does not exist there, default will be used
        // if no environment is set the default environment is used, which is 'production'
        // now that there is a setting for address in production config it will be read
        // the value from someOther will be the one from the default config because it was not overridden by production config
        let config = GlobalConfig.databaseConfig;
        should(config.get('address')).equal('http://admin:test@prod.test-server:1337');
        should(config.get('someOther')).equal('I am the default');
    }


    @test("should load value from develop config")
    asserts_dev() {
        // if no env was set or the setting / config does not exist there, this default will be used
        // in case of develop dir, ist empty, so default should be used
        let config;
        process.env['NODE_ENV'] = 'development';

        // new instance for new env (will destroy value on GlobalConfig as well)
        ServerConfig.destroyInstance();
        config = ServerConfig.getInstance().databaseConfig;

        should(config.get('address')).equal('http://admin:@develop.test-server:1337');
    }

    @test("should load value from production config")
    asserts_prod() {
        let config;
        process.env['environment'] = 'production'; // process.env['NODE_ENV'] will be used if this one is no set

        // new instance for new env (will destroy value on GlobalConfig as well)
        ServerConfig.destroyInstance();
        config = ServerConfig.getInstance().databaseConfig;

        should(config.get('address')).equal('http://admin:test@prod.test-server:1337');
    }

    @test("should load value from staging config")
    asserts_stage() {
        let config;
        process.env['environment'] = ConfigEnv.Staging;

        // new instance for new env (will destroy value on GlobalConfig as well)
        ServerConfig.destroyInstance();
        config = ServerConfig.getInstance().databaseConfig;

        // notice the default value in config.get()
        should(config.get('address', 'not found')).equal('http://admin:test@staging.test-server:1337');
    }

    @test("should load value from staging config")
    asserts_json() {
        let config;
        process.env['environment'] = ConfigEnv.Staging;
        process.env['json'] = '1';

        // new instance for new env (will destroy value on GlobalConfig as well)
        ServerConfig.destroyInstance();
        config = ServerConfig.getInstance().something;

        // notice the default value in config.get()
        should(config.get('test', 'not found')).equal('hallo world');
    }
}