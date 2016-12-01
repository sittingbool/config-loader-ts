"use strict";
const index_1 = require("../../src/index");
class ServerConfig extends index_1.ConfigLoader {
    configDir() {
        return __dirname;
    }
    static getInstance() {
        return super.getInstance();
    }
    get databaseConfig() {
        return this.configForName('database');
    }
}
exports.ServerConfig = ServerConfig;
exports.GlobalConfig = ServerConfig.getInstance();
//# sourceMappingURL=index.js.map