"use strict";
const index_1 = require("../../src/index");
class ServerConfig extends index_1.ConfigLoader {
    configDir() {
        let dir = __dirname, loadJson = process.env['json'];
        if (parseInt(loadJson) === 1) {
            dir = dir.replace('dist/', '');
        }
        return dir;
    }
    static getInstance() {
        return super.getInstance();
    }
    get databaseConfig() {
        return this.configForName('database');
    }
    get something() {
        return this.configForName('something');
    }
}
exports.ServerConfig = ServerConfig;
exports.GlobalConfig = ServerConfig.getInstance();
//# sourceMappingURL=index.js.map