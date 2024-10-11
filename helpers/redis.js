'use strict';

const redis = require('redis');
const constantHelper = require('../config/constant');
const { errorWithCode } = require('../config/errorcode');

class redisHelper {

    constructor() {
        console.log('redis host---->', constantHelper.REDIS_HOST);
        this.client = redis.createClient({
            url: `redis://:${constantHelper.REDIS_PASSWORD}@${constantHelper.REDIS_HOST}:${constantHelper.REDIS_PORT}`
        });

        this.client.on('error', async function (err) {
            if (err) {
                console.error('error connecting redis:', err);
                return;
            }
        });

        this.client.connect();
    }

    endConnection() {
        this.client.quit();
    }
}

module.exports = {
    redisHelper: redisHelper
};