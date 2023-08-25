const { createClient } = require('redis');
const config = require('./config');

const client = createClient({
    host: config.redis.host,
    port: config.redis.port,
    password: config.redis.password,
    url: config.redis.url
});
const startRedis = () => {
    client.connect();
    client.on('connect', () => {
        console.log(`Redis connected to`, new Date());
    });

    client.on('error', (err) => {
        console.log('Something went wrong ' + err);
    });
}

module.exports = client;
module.exports.startRedis = startRedis;
