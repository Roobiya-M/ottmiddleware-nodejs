'use strict';

const constantHelper = require('../config/constant');
const { errorWithCode } = require('../config/errorcode');
const commonHelper = require('../helpers/common');
const planSchema = require('../schemas/plan');
const planModel = require('../models/plan');

module.exports = {
    subscribe: async (req, res) => {
        try {
            await commonHelper.customLog('Subscribe Plan Log');
            let response = {};
            await commonHelper.customLog(`Subscribe Plan Request--->${JSON.stringify(req.body)}`);
            
            let schema = planSchema.subscribe;
            var { error, request } = schema.validate(req.body); 
            request = req.body;
            let tokenData = req.tokenData;
            if (error) { 
                await commonHelper.customLog(`Error----, ${error}`);
                response = await errorWithCode(1001);
                return await commonHelper.asJson(res, response);
            }

            if (
                request.activation_type !== constantHelper.ACTIVATION_TYPE_NEW && 
                request.activation_type !== constantHelper.ACTIVATION_TYPE_RENEW
            ) {
                response = await errorWithCode(1002);
                return await commonHelper.asJson(res, response);
            }

             
            let result =  await planModel.subscribe(request, tokenData);
            console.log("Final Response----",result)
            response = {
                'status': constantHelper.STATUS_SUCCESS,
                'message': 'Plan activation completed',
                'data': result
            }
            if (Array.isArray(result)) {
                if(result.length!=0 && result[0].status === 'FAILED'){
                    response = {
                        'status': constantHelper.STATUS_FAILED,
                        'message': result[0].message,
                        'data': result[0]
                    }
                }
            }
            return res.send(response);
        } catch (err) {
            await commonHelper.customLog(`Subscribe Plan Error--->${err}`);
            return await commonHelper.asJson(res, err);
        }
    }
}