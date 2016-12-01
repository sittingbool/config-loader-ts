import { ConfigObject, ConfigLoader } from "../../src/index";
export declare class ServerConfig extends ConfigLoader {
    configDir(): string;
    static getInstance(): ServerConfig;
    readonly databaseConfig: ConfigObject;
    readonly something: ConfigObject;
}
export declare const GlobalConfig: ServerConfig;
