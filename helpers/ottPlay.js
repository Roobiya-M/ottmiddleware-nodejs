'use strict';

const axios = require('axios');
const moment = require('moment');

const commonHelper = require('./common');
const redisHelper = require('./redis').redisHelper;
const redis = new redisHelper().client;
const constantHelper = require('../config/constant');
const { Op } = require("sequelize");

module.exports = {
    activatePlan: (request,plan) => {
        return new Promise(async(resolve, reject) => {
            try {
                let apiUrl = `${constantHelper.OTTPLAY_API_BASE_URL}${constantHelper.OTTPLAY_API_ACTIVATION_URI}`;
                let requestObj = {
                    'mobileNo': request.mobile_no,
                    'plan_code': plan.plan_code,
                    'plan_duration': plan.tariff_period,
                    'partnerReferenceID': constantHelper.OTTPLAY_PARTNER_REFERENECE_ID,
                    'partnerId': constantHelper.OTTPLAY_PARTNER_ID,
                    'displayName':request.custom_field_1,
                    'email': request.custom_field_3
                }
                
                await commonHelper.customLog(`apiUrl---> ${apiUrl}`, constantHelper.LOG_FILE_ACTIVATION_CABLEGUY);
                await commonHelper.customLog(`apiRequest---> ${JSON.stringify(requestObj)}`, constantHelper.LOG_FILE_ACTIVATION_CABLEGUY);

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
                    if (response.data.success === false) {
                        response = {
                            'error':  response.data.message,
                            'error_code': response.data.code
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