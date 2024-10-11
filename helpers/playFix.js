'use strict';

const axios = require('axios');
const moment = require('moment');

const commonHelper = require('./common');
const redisHelper = require('./redis').redisHelper;
const redis = new redisHelper().client;
const constantHelper = require('../config/constant');

module.exports = {
    activatePlan: (request) => {
        return new Promise(async(resolve, reject) => {
            try {
                let apiUrl = `${constantHelper.PLAYFIX_API_BASE_URL}`;
                let requestObj = {
                    'mobile': request.mobile,
                    'email': request.email,
                    'pay_status': 'true'
                } 
                
                await commonHelper.customLog(`apiUrl---> ${apiUrl}`, constantHelper.LOG_FILE_ACTIVATION_PLAYFIX);
                await commonHelper.customLog(`apiRequest---> ${JSON.stringify(requestObj)}`, constantHelper.LOG_FILE_ACTIVATION_PLAYFIX);

                axios({
                    method: 'post',
                    url: apiUrl,
                    headers: {
                        'Content-Type' : 'application/json'
                    },
                    timeout: 120000,
                    data: requestObj
                }).then(async (response) => {
                    await commonHelper.customLog(`apiResponse---> ${JSON.stringify(response.data)}`);
                    if (!response.data.status || response.data.status !== 'Success') {
                        response = {
                            // 'error_code': response.data.d.returnCode,
                            'error':  response.data.message
                        }
                    }
                    resolve(response);
                }).catch(async (error) => {
                    await commonHelper.customLog(`apiError---> ${error}`);
                    resolve(error);
                });
            } catch (err) {
                await commonHelper.customLog(`Error---> ${err}`);
                resolve(err);
            }
        })
    }
}