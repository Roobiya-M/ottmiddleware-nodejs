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
                let modelName = await commonHelper.getModelName(plan.aggregator);
                let activation = await modelName.findAll({
                    where: {
                        'customer_id': request.customer_id,
                        'activation_status':{
                            [Op.ne]: 'PENDING'
                        }
                    }
                });
                if (activation.length === 0) {
                    let addCustomerUrl = await module.exports.addCustomer(request)
                    if (addCustomerUrl.data.success === false) {
                        let response = {
                            'error': addCustomerUrl.data.msg,
                            'message': addCustomerUrl.data.msg
                        }
                        resolve(response)
                    }
                }
                let mode =''
                if (request.activation_type === 'NEW') {
                    mode = 'ADD'
                }
                let apiUrl = `${constantHelper.CABLEGUY_API_BASE_URL}${constantHelper.CABLEGUY_API_ACTIVATION_URI}`;
                let requestObj = {
                    'phone': request.mobile_no,
                    'bou_code': plan.provider_plan_code,
                    'mode': mode,
                    'lcoCode': constantHelper.CABLEGUY_LCOCODE,
                    'login_id': constantHelper.CABLEGUY_LOGIN_ID,
                    'api_token':constantHelper.CABLEGUY_API_TOKEN
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
                            'error':  response.data.msg
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
    },
    addCustomer: (request) => {
        return new Promise(async(resolve, reject) => {
            try {
                let apiUrl = `${constantHelper.CABLEGUY_API_BASE_URL}${constantHelper.CABLEGUY_API_ADD_CUSTOMER_URI}`;
                let requestObj = {
                    'name': request.custom_field_4,
                    'phone': request.mobile_no,
                    'address': request.custom_field_5,
                    'lcoCode': constantHelper.CABLEGUY_LCOCODE,
                    'login_id': constantHelper.CABLEGUY_LOGIN_ID,
                    'api_token':constantHelper.CABLEGUY_API_TOKEN
                }
                
                await commonHelper.customLog(`Sabot Add Customer apiUrl---> ${apiUrl}`, constantHelper.LOG_FILE_ACTIVATION_CABLEGUY);
                await commonHelper.customLog(`Sabot Add Customer apiRequest---> ${JSON.stringify(requestObj)}`, constantHelper.LOG_FILE_ACTIVATION_CABLEGUY);

                axios({
                    method: 'post',
                    url: apiUrl,
                    headers: {
                        'Content-Type' : 'application/json'
                    },
                    timeout: 120000,
                    data: requestObj
                }).then(async (response) => {
                    await commonHelper.customLog(`Sabot Add Customer apiResponse---> ${JSON.stringify(response.data)}`);
                    resolve(response);
                }).catch(async (error) => {
                    await commonHelper.customLog(`Sabot Add Customer apiError---> ${error}`);
                    resolve(error);
                });
            } catch (err) {
                await commonHelper.customLog(`Error---> ${err}`);
                resolve(err);
            }
        })
    },
}