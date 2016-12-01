import { suite, test } from "mocha-typescript";
import * as should from 'should';
import {GlobalConfig, ServerConfig} from "./cont-test/index";
import {ConfigEnv} from "../src/index";


@suite("ConfigLoaderTest")
class ConfigLoaderTest {

    // NOTE: please check the files in test/conf-test to understand what we do here

    @test("should load default config if no env was set")
    asserts_default() {
        // if no env was set or the setting / config does not exist there, this default will be used
        let config = GlobalConfig.databaseConfig;
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
}