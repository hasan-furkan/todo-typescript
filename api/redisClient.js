const redis = require('redis');
const config = require('./config');

const client = redis.createClient({
    host: config.redis.host,
    port: config.redis.port,
    password: config.redis.password
});

client.on('connect', function() {
    console.log(`Connected to Redis on ${config.redis.host}:${config.redis.port} => ${Date.now()}`);
});

client.on('error', function (err) {
    console.log('Redis error: ' + err);
});

module.exports = client;
