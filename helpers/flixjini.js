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
                let transactionid = await commonHelper.generateRandomString();
                let stringTobeHashed = transactionid+'|'+constantHelper.FLIXJINI_ACTIVATION_API_SECRET
                let secureHash = await commonHelper.createHash256(stringTobeHashed)
                let apiUrl = `${constantHelper.FLIXJINI_API_BASE_URL}${constantHelper.FLIXJINI_API_ACTIVATION_URI}${constantHelper.FLIXJINI_PARTNER_ID}?txnid=${transactionid}&securehash=${secureHash}&api_user_id=${constantHelper.FLIXJINI_API_USER_ID}`;
                let activation_date = moment().format('YYYY-MM-DD')
                let deactivation_date = null
                switch(true) {
                    case (plan.tariff_period < 12) :
                        console.log("tariff period < 12") 
                        deactivation_date = moment().add((plan.tariff_period * 30),'days').format('YYYY-MM-DD')
                    break;
                    default: 
                    console.log("tariff period = 12") 
                        deactivation_date = moment().add(plan.tariff_period,'months').format('YYYY-MM-DD')
                }
                let frName = ''
                let frCode = ''
                if (request.custom_field_1) {
                    frCode = request.custom_field_1
                }
                if (request.custom_field_2) {
                    frName = request.custom_field_2
                }
                let requestObj = {
                    "customer_id": request.customer_id,
                    "customer_name": request.custom_field_4,
                    "partner_order_id": "",
                    "ott_plan": {
                        "plan_id": plan.provider_plan_code,
                        "plan_name": plan.plan_name,
                        "activation_date": activation_date,
                        "deactivation_date": deactivation_date,
                        "type_of_plan": "plan"
                    },
                    "broadband_plan": {
                        "plan_id": "",
                        "plan_name": "",
                        "activation_date": activation_date,
                        "deactivation_date": deactivation_date
                    },        
                    "mobile_number": request.mobile_no,
                    "email_id": request.custom_field_3,
                    "city_name": request.custom_field_5,
                    "server_name": "PORTAL",
                    "isp": {
                        "isp_id": frCode,
                        "isp_name": frName,
                        "isp_support_phone": "",
                        "isp_support_email": ""
                    }
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
                    if (response.data.succesful === false) {
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