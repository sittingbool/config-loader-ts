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
    configDir(): string;
    constructor();
    static getInstance(): ConfigLoader;
    static destroyInstance(): void;
    private loadConfigData(name);
    protected configForName(name: string): ConfigObject;
    loadedConfigData(): ConfigObject;
}
