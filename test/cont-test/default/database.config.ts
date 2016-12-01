export interface IDatabaseConfig {
    address: string;
}

let config: IDatabaseConfig = {
    address: 'http://admin:@develop.test-server:1337',
};

export default config;