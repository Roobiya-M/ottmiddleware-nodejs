'use strict';

const axios = require('axios');
const moment = require('moment');

const commonHelper = require('./common');
const redisHelper = require('./redis').redisHelper;
const redis = new redisHelper().client;
const constantHelper = require('../config/constant');

module.exports = {
    activatePlan: (plan, request) => {
        return new Promise(async(resolve, reject) => {
            try {
                let referenceId = await redis.incr(`H8_REF`);
                let apiUrl = `${constantHelper.H8_API_BASE_URL}/${constantHelper.H8_API_RENEW_URI}`;
                let requestObj = {
                    'Request': {
                        'requestDate': moment().format('YYYY-MM-DD HH:mm:ss'),
                        'extTransactionId': referenceId,
                        'systemId': constantHelper.H8_SYSTEM_ID,
                        'password': constantHelper.H8_SYSTEM_PASSWORD
                    },
                    'UserName': request.custom_field_2,
                    'PlanName': plan.provider_plan_code
                } 
                
                await commonHelper.customLog(`apiUrl---> ${apiUrl}`, constantHelper.LOG_FILE_ACTIVATION_H8);
                await commonHelper.customLog(`apiRequest---> ${JSON.stringify(requestObj)}`, constantHelper.LOG_FILE_ACTIVATION_H8);

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
                    if (!response.data.d.Status || response.data.d.Status !== 'Success') {
                        response = {
                            'error_code': response.data.d.returnCode,
                            'error':  response.data.d.returnMessage
                        }
                    }
                    resolve(response);
                }).catch(async (error) => {
                    await commonHelper.customLog(`apiError---> ${error}`);
                    console.error(error.response.data)
                    resolve(error);
                });
            } catch (err) {
                await commonHelper.customLog(`Error---> ${err}`);
                resolve(err);
            }
        })
    }
}