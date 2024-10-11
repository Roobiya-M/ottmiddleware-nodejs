'use strict';

const {Op} = require('sequelize');
const moment = require('moment');

const sequelize = require('../db/models/index').sequelize;
const initModels = require('../db/models/init-models');
const models = initModels(sequelize);
const planModel = models.plan;
const constantHelper = require('../config/constant');
const { errorWithCode } = require('../config/errorcode');
const commonHelper = require('../helpers/common');
const H8Helper = require('../helpers/H8');
const mailHelper = require('../helpers/mail');
const playFixHelper = require('../helpers/playFix')
const cableGuyHelper = require('../helpers/cableGuy')
const ottPlayHelper = require('../helpers/ottPlay')
const flixjiniHelper = require('../helpers/flixjini')
const smsHelper = require('../helpers/smsHelper')

const getPlan = (planData) => {
    return new Promise(async (resolve, reject) => {
        try {
            let whereProvider = {}
            if (planData.not_aggregator) {
                whereProvider.aggregator = {
                    [Op.ne]: planData.not_aggregator
                } 
            }
            if (planData.aggregator) {
                whereProvider.aggregator = planData.aggregator
            }
            let plan = await models.provider_plan_detail.findOne({
                attributes: [
                    'plan.plan_code',
                    'plan.plan_name',
                    'provider_plan_code',
                    'tariff_period',
                    'plan_price',
                    'provider_id',
                    'plan_id',
                    'provider.aggregator'
                ],
                include: [{
                    model: models.plan, 
                    as: 'plan',
                    required: true,
                    attributes: [],
                    where: {
                        'plan_code': planData.plan_code
                    }
                },{
                    model: models.provider, 
                    as: 'provider',
                    required: true,
                    attributes: [],
                    where: whereProvider
                }],
                raw: true,
                where: {
                    'tariff_period': planData.tariff_period
                }
            });

            await commonHelper.customLog(`Plan Detail--->${JSON.stringify(plan)}`);
            if (!plan) {
                let response = await errorWithCode(1007);
                return reject(response);
            }

            resolve(plan);
        } catch (err) {
            console.log(JSON.stringify(err));
            reject(err);
        }  
    }); 
}

const createActivation = (request, plan, tokenData) => {
    return new Promise(async (resolve, reject) => {
        try  {
            let insertObj = {
                'activation_id': await commonHelper.generateKey(),
                'provider_id': plan.provider_id,
                'plan_id': plan.plan_id,
                'customer_id': request.customer_id,
                'initiator_id': tokenData.partner_id,
                'plan_price': plan.plan_price,
                'tariff_period': plan.tariff_period,
                'tariff_period_type': plan.tariff_period_type,
                'activation_type': request.activation_type,
                'mobile_no': request.mobile_no,
                'email': request.email,
                'custom_field_1': request.custom_field_1,
                'custom_field_2': request.custom_field_2,
                'custom_field_3': request.custom_field_3,
                'custom_field_4': request.custom_field_4,
                'custom_field_5': request.custom_field_5,
                'activation_status': constantHelper.ACTIVATON_STATUS_PENDING,
                'created_at': moment().format(constantHelper.DB_DATETIME_FORMAT),
                'created_by': tokenData.partner_id
            }

            let modelName = await commonHelper.getModelName(plan.aggregator);
            let activation = await modelName.create(insertObj);
            resolve(activation.activation_id);
        } catch (err) {
            reject(err);
        }
    })
}

const updateActivation = (activationId, updateData, aggregator) => {
    return new Promise(async (resolve, reject) => {
        try  {
            let modelName = await commonHelper.getModelName(aggregator);
            updateData.updated_at = moment().format(constantHelper.DB_DATETIME_FORMAT);
            let updateResult = await modelName.update(updateData, {
                where: {
                    'activation_id': activationId
                }
            });

            resolve(updateResult)
        } catch (err) {
            reject(err);
        }
    })
}

module.exports = {
    subscribe: (request, tokenData) => {
        return new Promise(async (resolve, reject) => {
            try {
                let response = {};
                let responseArray = [];
                let requiredParams = ['plan_code', 'tariff_period'];
                let activationType = request.activation_type;
                // if (activationType === constantHelper.ACTIVATION_TYPE_RENEW) {
                //     requiredParams = ['plan_code', 'tariff_period', 'contract_id'];
                // }

                let planList = request.plan_list;
                delete request.plan_list;
                for (let index = 0; index < planList.length; index++) {
                    let planObj = planList[index];
                    let activationId = null
                    let plan = {}
                    await commonHelper.checkRequiredParam(planObj, requiredParams);

                    if (planObj.plan_code.substring(0, 5) === constantHelper.BASE_OTT_ONEDIGITAL_PLANCODE_PREFIX ) {
                        console.log('BSTCO Plans')
                        if (activationType == 'NEW') {
                            planObj.not_aggregator = constantHelper.AGGREGATOR_H8
                            plan = await getPlan(planObj);
                            console.log("plan-provider details for BSTCO [new activation] from db---->",plan)
                            activationId = await createActivation(request, plan, tokenData);
                            response = await flixjiniHelper.activatePlan(request, plan);
                            if(response.error) {
                                // response.error_code = response.error
                                let message = `<p>Dear Team</p>
                                    <p>Please check the below request for Flixjini Plan Activation.</p>
                                    <p><b>Customer Id:</b> ${request.customer_id}</p>
                                    <p><b>Plan Code:</b> ${plan.plan_code}</p>
                                    <p><b>Plan name:</b> ${plan.plan_name}</p>
                                    <p><b>Error:</b> ${response.error}</p>`;
                                await mailHelper.sendMail(constantHelper.FAILED_MAIL_IDS, `Failed mail for Flixjini Plan Activation - ${request.customer_id}`, message);
                            } else {
                                let message = constantHelper.SMS_OTT_ACTIVATIONSUCCESS_FORMAT;
                                await smsHelper.sendSMS(request.mobile_no, message)
                            }
                        } else if (activationType == 'RENEW') {
                            planObj.aggregator = constantHelper.AGGREGATOR_H8
                            plan = await getPlan(planObj);
                            delete planObj.aggregator
                            console.log("h8 plan-provider details for BSTCO [renew] from db---->",plan)
                            activationId = await createActivation(request, plan, tokenData);
                            response = await H8Helper.activatePlan(plan, request);
                            console.log('BSTCO [renew] response from H8----',response)
                            response.failed_aggregator = []
                            if ('error' in response || response.error || (response.response && response.response.status && response.response.status === 500)) {
                                if (response.response) {
                                    if (response.response.status && response.response.status === 500) {
                                        response.error = 'Axios Error'
                                        if (response.response.data && response.response.data.Message) {
                                            response.error = response.response.data.Message
                                        }
                                        response.error_code = response.response.status
                                        
                                    }
                                }
                                    
                                response.failed_aggregator.push(plan.aggregator)
                                let message = `<p>Dear Team</p>
                                    <p>Please check the below request for ONEDigital Renew.</p>
                                    <p><b>Customer Id:</b> ${request.customer_id}</p>
                                    <p><b>Plan Code:</b> ${planObj.plan_code}</p>
                                    <p><b>Plan name:</b> ${plan.plan_name}</p>
                                    <p><b>ONEDigital Id:</b> ${plan.provider_plan_code}</p>
                                    <p><b>FRCODE:</b> ${request.custom_field_1}</p>
                                    <p><b>Error:</b> ${response.error}</p>`;
                                await mailHelper.sendMail(constantHelper.H8_FAILED_MAIL_IDS, `Failed mail for ONEDigital Renew - ${request.customer_id}`, message);
                                
                            } 
                            console.log('planobj---',planObj)
                            planObj.not_aggregator = constantHelper.AGGREGATOR_H8
                            let ottPlan = await getPlan(planObj);
                            console.log("ott plan-provider details from db for bstco [renew]---->",ottPlan)
                            let ottActivationId = await createActivation(request, ottPlan, tokenData);
                            let ottResponse = await flixjiniHelper.activatePlan(request, ottPlan);
                            let ottUpdate = {}
                            if(ottResponse.error) {
                                // response.error_code = response.error
                                let message = `<p>Dear Team</p>
                                    <p>Please check the below request for Flixjini Plan Activation.</p>
                                    <p><b>Customer Id:</b> ${request.customer_id}</p>
                                    <p><b>Plan Code:</b> ${ottPlan.plan_code}</p>
                                    <p><b>Plan name:</b> ${ottPlan.plan_name}</p>
                                    <p><b>Error:</b> ${ottResponse.error}</p>`;
                                await mailHelper.sendMail(constantHelper.FAILED_MAIL_IDS, `Failed mail for Flixjini Plan Activation - ${request.customer_id}`, message);
                                ottUpdate = {
                                    'activation_status': constantHelper.ACTIVATON_STATUS_FAILED,
                                    'reason': ottResponse.error,
                                    'error_code': ottResponse.error_code
                                }
                                response.failed_aggregator.push(ottPlan.aggregator)
                            } else {
                                let message = constantHelper.SMS_OTT_ACTIVATIONSUCCESS_FORMAT;
                                await smsHelper.sendSMS(request.mobile_no, message)
                                ottUpdate = {
                                    'activation_status': constantHelper.ACTIVATON_STATUS_SUCCESS,
                                    'contract_no': ''
                                }

                            }
                            console.log("Data for Updation====>",ottUpdate)
                            await updateActivation(ottActivationId, ottUpdate, ottPlan.aggregator);
                            
                        }
                    } else {

                        // let plan = await getPlan(planObj);
                        plan = await getPlan(planObj);
                        console.log("plan-provider details from db---->",plan)
                        // let activationId = await createActivation(request, plan, tokenData);
                        activationId = await createActivation(request, plan, tokenData);
                        switch (plan.aggregator) {
                            case constantHelper.AGGREGATOR_H8:  
                                response = await H8Helper.activatePlan(plan, request);
                                if ('error' in response || response.error) {
                                    let message = `<p>Dear Team</p>
                                        <p>Please check the below request for ONEDigital Renew.</p>
                                        <p><b>Customer Id:</b> ${request.customer_id}</p>
                                        <p><b>Plan Code:</b> ${planObj.plan_code}</p>
                                        <p><b>Plan name:</b> ${plan.plan_name}</p>
                                        <p><b>ONEDigital Id:</b> ${plan.provider_plan_code}</p>
                                        <p><b>FRCODE:</b> ${request.custom_field_1}</p>
                                        <p><b>Error:</b> ${response.error}</p>`;
                                    await mailHelper.sendMail(constantHelper.H8_FAILED_MAIL_IDS, `Failed mail for ONEDigital Renew - ${request.customer_id}`, message);
                                }
                                // } else {
                                //     if (plan.plan_code.substring(0, 5) === constantHelper.BASE_OTT_ONEDIGITAL_PLANCODE_PREFIX && activationType == 'RENEW') {
                                //         console.log('planobj---',planObj)
                                //         planObj.aggregator = constantHelper.AGGREGATOR_OTTPLAY
                                //         let ottPlan = await getPlan(planObj);
                                //         console.log("plan-provider details from db for bstco---->",ottPlan)
                                //         let ottActivationId = await createActivation(request, ottPlan, tokenData);
                                //         let ottResponse = await flixjiniHelper.activatePlan(request, ottPlan);
                                //         let ottUpdate = {}
                                //         if(ottResponse.error) {
                                //             // response.error_code = response.error
                                //             let message = `<p>Dear Team</p>
                                //                 <p>Please check the below request for Flixjini Plan Activation.</p>
                                //                 <p><b>Customer Id:</b> ${request.customer_id}</p>
                                //                 <p><b>Plan Code:</b> ${ottPlan.plan_code}</p>
                                //                 <p><b>Plan name:</b> ${ottPlan.plan_name}</p>
                                //                 <p><b>Error:</b> ${ottResponse.error}</p>`;
                                //             await mailHelper.sendMail(constantHelper.FAILED_MAIL_IDS, `Failed mail for Flixjini Plan Activation - ${request.customer_id}`, message);
                                //             ottUpdate = {
                                //                 'activation_status': constantHelper.ACTIVATON_STATUS_FAILED,
                                //                 'reason': ottResponse.error,
                                //                 'error_code': ottResponse.error_code
                                //             }
                                //         } else {
                                //             let message = constantHelper.SMS_OTT_ACTIVATIONSUCCESS_FORMAT;
                                //             await smsHelper.sendSMS(request.mobile_no, message)
                                //             ottUpdate = {
                                //                 'activation_status': constantHelper.ACTIVATON_STATUS_SUCCESS,
                                //                 'contract_no': ''
                                //             }
        
                                //         }
                                //         console.log("Data for Updation====>",ottUpdate)
                                //         await updateActivation(ottActivationId, ottUpdate, ottPlan.aggregator);
                                //     }
                                // }
                            
                                break;
                            case constantHelper.AGGREGATOR_PLAYFIX:
                            case constantHelper.AGGREGATOR_CABLEGUY:
                            case constantHelper.AGGREGATOR_OTTPLAY:
                                response = await flixjiniHelper.activatePlan(request, plan);
                                if(response.error) {
                                    // response.error_code = response.error
                                    let message = `<p>Dear Team</p>
                                        <p>Please check the below request for Flixjini Plan Activation.</p>
                                        <p><b>Customer Id:</b> ${request.customer_id}</p>
                                        <p><b>Plan Code:</b> ${plan.plan_code}</p>
                                        <p><b>Plan name:</b> ${plan.plan_name}</p>
                                        <p><b>Error:</b> ${response.error}</p>`;
                                    await mailHelper.sendMail(constantHelper.FAILED_MAIL_IDS, `Failed mail for Flixjini Plan Activation - ${request.customer_id}`, message);
                                } else {
                                    let message = constantHelper.SMS_OTT_ACTIVATIONSUCCESS_FORMAT;
                                    await smsHelper.sendSMS(request.mobile_no, message)
                                }
                                break;
                            default:
                                response = await errorWithCode();
                        }

                    }                    
                    let result = {
                        'plan_name': plan.plan_name,
                        'plan_code': plan.plan_code
                    }
                    if ('error_code' in response || response.error_code) {
                        result.status = constantHelper.ACTIVATON_STATUS_FAILED;
                        result.message = response.error;
                        result.error_code = response.error_code;
                        if (response.failed_aggregator && response.failed_aggregator.length > 0) {
                            result.failed_aggregator = response.failed_aggregator
                        }
                        var updateData = {
                            'activation_status': result.status,
                            'reason': result.message,
                            'error_code': result.error_code
                        }
                    } else {
                        result.status = constantHelper.ACTIVATON_STATUS_SUCCESS;
                        result.message = 'Plan activated successfully';

                        var updateData = {
                            'activation_status': result.status,
                            'contract_no': ''
                        }
                    }
                    console.log("Data for Updation====>",updateData)
                    await updateActivation(activationId, updateData, plan.aggregator);
                    
                    responseArray.push(result);
                    console.log("Final response=====>",responseArray)
                }
                if (responseArray.status === 'FAILED' || responseArray.error_code) {
                    reject(responseArray)
                }

                resolve(responseArray);
            } catch (err) {
                console.log(JSON.stringify(err));
                reject(err);
            }
        })
    }
}