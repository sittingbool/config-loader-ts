# Config Loader (TS)

This is a config loader, available in JS ES6, written in Typescript.
The Goal:

- support environment based configurations
- support a default configuration for all environments
- override default settings with environment based settings and keep all the other settings from default

## Getting Started

- install the package via npm ``npm install config-loader-ts --save`` .
- create a folder structure using the folders `default` for the default settings and one for each of your environments. Note that the default environment will be set to `production`.
- if the folder for the current environment is not set, the settings from `default` will be used.
- place your settings as ts/js-file or json file in those subfolders for your environment and the default dir.
- make sure you use the naming convention `<name>.config.<ext>` e.g. `my-conf.config.ts` or `my-conf.config.json`.
- the current environment is primarily read from `process.env.environment` so you can set it independent fron your Node.js environment if needed. alternatively it is read from `process.env.NODE_ENV` which is the default environment setting for node.js.
- create a subclass of `ConfigLoader` and override the `configDir()` method so that it returns the location of the parent directory of all your environment specific config folders if its not the same as where this subclass is located.
- write your own settings access function like shown below.
- Please check the test directory. It contains an example in itself and has additional info in comments.

```
// folder structure example (see test directory for example):

/app
    /configs
        /default
            my-conf.config.ts
        /development
            // missing here, so default will be used
        /staging
            my-conf.config.ts
        /production
            my-conf.config.ts

```

```
export class MyConfig extends ConfigLoader{

    // overridden
    // return the directoty that has your config directories
    configDir():string
    {
        let dir =  __dirname, loadJson = process.env['json'];

        if ( parseInt(loadJson) === 1 ) {
            dir = dir.replace('dist/', '');
        }

        return dir;
    }

    // will return an instance of ConfigObject containning all your config 
    // merged from default and environment
    get myConfig(): ConfigObject
    {
        return this.configForName('my-conf'); // the string parameter is the <name> part in the file name convention (see above)
    }
}
```

### ConfigLoader

#### Methods:

```
static getInstance() // return singleton instance

static destroyInstance() // reset singleton instance

configDir():string // return location of the config base-dir (see getting started instructions!)

protected configForName( name: string): ConfigObject // return the config object for a specific file name (see above for conventions)

loadedConfigData(): ConfigObject // return combined config object of all loaded configs (will be loaded only when used)

```

#### Properties:

```
environment: string; // the name of the anvironment (override this with a getter in your subclass if you need to set it manually)

```

### ConfigObject

#### Methods:

```
get( key: string, defaultValue?: any): any // get a setting for a specified key. if default value is given, the default will be returned if setting is not found for this key.
```


## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details


