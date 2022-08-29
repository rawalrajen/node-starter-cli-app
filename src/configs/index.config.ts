const config = {
    appName: 'crypto-compare',
    environment: process.env.NODE_ENV,
    mongodb: {
        host: 'mongodb://127.0.0.1',
        db: 'local',
        username: '',
        password: ''
    },
    cryptocompare: {
        baseUrl: 'https://min-api.cryptocompare.com/data/price',
        token: '2e0f215f35fca816c20a745ca6a24203a439c361dd29a26dcb4c693908595c9d',
        timeout: 4000
    },
    remoteFileUrl: ''
};
export default config;
