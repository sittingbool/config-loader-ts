export declare const ConfigEnv: {
    Production: string;
    Development: string;
    Staging: string;
};
export declare class ConfigObject {
    constructor(data?: Object);
    get(key: string, defaultValue?: any): any;
}
export declare class ConfigLoader {
    static instance: ConfigLoader;
    environment: string;
    private configs;
    constructor();
    static getInstance(): ConfigLoader;
    private loadConfigData(name);
    private configForName(name);
    loadedConfigData(): ConfigObject;
}
