"use strict";
const fs = require('fs');
const path = require('path');
const _ = require('lodash');
exports.ConfigEnv = {
    Production: 'production',
    Development: 'development',
    Staging: 'staging'
};
class ConfigObject {
    constructor(data) {
        if (data) {
            Object.keys(data).forEach((key) => {
                if (data.hasOwnProperty(key)) {
                    this[key] = data[key];
                }
            });
        }
    }
    get(key, defaultValue) {
        let val = this[key];
        if (typeof val === 'undefined' && typeof defaultValue !== 'undefined') {
            val = defaultValue;
        }
        return val;
    }
}
exports.ConfigObject = ConfigObject;
class ConfigLoader {
    constructor() {
        this.configs = {};
        let env = process.env['environment'] || process.env['NODE_ENV'];
        let confFiles = [], filePaths = [];
        this.environment = env || exports.ConfigEnv.Development;
        if (env) {
            console.log('Laded config for environment: ' + env + '.');
        }
        else {
            console.log('No environment specified. Loading config for environment: ' +
                this.environment + '.');
        }
        filePaths.push(path.join(this.configDir(), 'default'));
        filePaths.push(path.join(this.configDir(), this.environment));
        filePaths.forEach((fPath) => {
            if (fs.existsSync(fPath)) {
                confFiles = confFiles.concat(fs.readdirSync(fPath));
            }
        });
        confFiles = _.uniq(confFiles);
        confFiles = confFiles.filter(item => {
            let extName = path.extname(item);
            return (extName === '.js' || extName === '.json');
        });
        confFiles.forEach((file) => {
            this.loadConfigData(file);
        });
    }
    configDir() {
        return __dirname;
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new this();
        }
        return this.instance;
    }
    static destroyInstance() {
        this.instance = null;
    }
    loadConfigData(name) {
        let envFilePath = path.join(this.configDir(), this.environment, name), defaultPath = path.join(this.configDir(), 'default', name), data = {};
        let paths = [defaultPath, envFilePath];
        paths = paths.filter((item) => {
            return path.extname(item) !== '.map' && fs.existsSync(item);
        });
        paths.forEach((fPath) => {
            let current = require(fPath);
            switch (path.extname(name)) {
                case '':
                case '.js':
                    if (!current || typeof current !== 'object' || !current.default || typeof current.default !== 'object') {
                        current = {};
                    }
                    else {
                        current = current.default;
                    }
                    break;
                case '.json':
                    if (!current || typeof current !== 'object') {
                        current = {};
                    }
                    break;
                default:
                    current = {};
                    break;
            }
            data = _.extend(data, current);
        });
        data = new ConfigObject(data);
        if (path.extname(name).length) {
            name = name.substring(0, name.length - path.extname(name).length);
            name = name.replace('.config', '');
        }
        this.configs[name] = data;
    }
    configForName(name) {
        if (!this.configs[name]) {
            return null;
        }
        return this.configs[name];
    }
    loadedConfigData() {
        return new ConfigObject(this.configs);
    }
}
ConfigLoader.instance = null;
exports.ConfigLoader = ConfigLoader;
//# sourceMappingURL=index.js.map