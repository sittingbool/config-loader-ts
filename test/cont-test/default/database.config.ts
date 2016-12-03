export interface IDatabaseConfig {
    address: string;
    someOther?: string;
}

let config: IDatabaseConfig = {
    address: 'http://admin:@develop.test-server:1337',
    someOther: 'I am the default'
};

export default config;