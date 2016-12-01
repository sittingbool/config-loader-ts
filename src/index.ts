//----------------------------------------------------------------------------------------------------------
import * as fs from 'fs';
import * as path from 'path';
import * as _ from 'lodash';
import * as loadJsonFile from 'load-json-file';
//----------------------------------------------------------------------------------------------------------


//----------------------------------------------------------------------------------------------------------
export const ConfigEnv = {
    Production:  'production',
    Development: 'development',
    Staging:     'staging'
};
//----------------------------------------------------------------------------------------------------------


//----------------------------------------------------------------------------------------------------------
export class ConfigObject
//----------------------------------------------------------------------------------------------------------
{
    //------------------------------------------------------------------------------------------------------
    constructor( data?: Object)
    //------------------------------------------------------------------------------------------------------
    {
        if ( data ) {
            Object.keys(data).forEach(( key) => {
                if ( data.hasOwnProperty(key) ) {
                    this[key] = data[key];
                }
            });
        }
    }


    //------------------------------------------------------------------------------------------------------
    get( key: string, defaultValue?: any): any
    //------------------------------------------------------------------------------------------------------
    {
        let val = this[key];

        if ( typeof val === 'undefined' && typeof defaultValue !== 'undefined' ) {
            val = defaultValue;
        }

        return val;
    }
}


//----------------------------------------------------------------------------------------------------------
export class ConfigLoader
//----------------------------------------------------------------------------------------------------------
{
    //------------------------------------------------------------------------------------------------------
    static instance: ConfigLoader = null;
    environment: string;
    private configs: Object = {};
    //------------------------------------------------------------------------------------------------------


    //------------------------------------------------------------------------------------------------------
    configDir():string
    //------------------------------------------------------------------------------------------------------
    {
        return __dirname;
    }


    //------------------------------------------------------------------------------------------------------
    constructor()
    //------------------------------------------------------------------------------------------------------
    {
        let env = process.env['environment'] || process.env['NODE_ENV'];

        let confFiles: string[] = [], filePaths = [];

        this.environment = env || ConfigEnv.Production;

        if ( env ) {
            console.log('Laded config for environment: ' + env + '.');
        } else {
            console.log('No environment specified. Loading config for environment: ' +
                this.environment + '.');
        }

        filePaths.push( path.join(this.configDir(), 'default'));
        filePaths.push( path.join(this.configDir(), this.environment));

        filePaths.forEach((fPath: string) => {
            if ( fs.existsSync(fPath) ) {
                confFiles = confFiles.concat( fs.readdirSync( fPath) );
            }
        });

        confFiles = _.uniq(confFiles);

        confFiles = confFiles.filter(item => {
            let extName = path.extname(item);
            return (extName === '.js' || extName === '.json');
        });

        confFiles.forEach(( file: string) => {
            this.loadConfigData(file);
        });
    }


    //------------------------------------------------------------------------------------------------------
    static getInstance()
    //------------------------------------------------------------------------------------------------------
    {
        if ( !this.instance ) {
            this.instance = new this();
        }

        return this.instance;
    }


    //------------------------------------------------------------------------------------------------------
    static destroyInstance()
    //------------------------------------------------------------------------------------------------------
    {
        this.instance = null;
    }


    //------------------------------------------------------------------------------------------------------
    private loadConfigData( name: string)
    //------------------------------------------------------------------------------------------------------
    {
        let envFilePath = path.join(this.configDir(), this.environment, name),
            defaultPath = path.join(this.configDir(), 'default', name), data = {};
        let paths = [defaultPath, envFilePath];

        paths = paths.filter((item: string) => {
            return path.extname(item) !== '.map' && fs.existsSync(item);
        });

        paths.forEach((fPath) => {
            let current;
            switch ( path.extname(name) ) {
                case '': // for directory (should contain dao.index.ts / index.js)
                case '.js':
                    current = require(fPath);
                    if ( !current || typeof current !== 'object' || !current.default ||
                        typeof current.default !== 'object' )
                    {
                        current = {};
                    } else {
                        current = current.default;
                    }
                    break;
                case '.json':
                    try {
                        current = loadJsonFile.sync(fPath);
                    } catch ( err ) {
                        console.error(err);
                    }
                    if ( !current || typeof current !== 'object' ) {
                        current = {};
                    }
                    break;

                default:
                    current = {};
                    break;
            }

            data = _.extend(data,current);
        });

        data = new ConfigObject(data);

        if ( path.extname(name).length ) {
            name = name.substring(0, name.length - path.extname(name).length);
            name = name.replace('.config', '');
        }

        this.configs[name] = data;
    }


    //------------------------------------------------------------------------------------------------------
    protected configForName( name: string): ConfigObject
    //------------------------------------------------------------------------------------------------------
    {
        if ( ! this.configs[name] ) {
            return null;
        }

        return this.configs[name];
    }


    //------------------------------------------------------------------------------------------------------
    loadedConfigData(): ConfigObject
    //------------------------------------------------------------------------------------------------------
    {
        return new ConfigObject(this.configs);
    }
}