'use strict';

const partnerModel = require('../models/partner');
const commonHelper = require('../helpers/common');
const jwtHelper = require('../helpers/jwt');
const constantHelper = require('../config/constant');
const { errorWithCode } = require('../config/errorcode');
const partnerSchema = require('../schemas/partner');

module.exports = {
    login: async (req, res) => {
        try {
            let response = {};
            await commonHelper.customLog(`Login API Start`);
            await commonHelper.customLog(`Login API Request---.${JSON.stringify(req.body)}`);
            let schema = partnerSchema.login;
            var { error, request } = schema.validate(req.body); 
            request = req.body;
            if (error) { 
                console.log('Error----', error);
                await commonHelper.customLog(`Error----, ${error}`);
                response = await errorWithCode(1001);
                return await commonHelper.asJson(res, response);
            }

            let partner = await partnerModel.getByUsername(request.username);
            await commonHelper.comparePasswordHash(request.password, partner.password_hash);
            console.log('New passowrd--->',await commonHelper.generatePasswordHash('roobiya'));
            if (partner.source !== request.source) {
                response = await errorWithCode(1005);
                return await commonHelper.asJson(res, response);
            }

            if (partner.status === constantHelper.USER_STATUS_INACTIVE) {
                response = await errorWithCode(1006);
                return await commonHelper.asJson(res, response);
            }

            let tokenData = {
                'name': partner.partner_name,
                'partner_id': partner.partner_id,
                'source': partner.source
            };

            let jwtToken = await jwtHelper.generateJwt(tokenData);
            response = {
                'status': constantHelper.STATUS_SUCCESS,
                'message': 'User logged in successfully',
                'data': {
                    'access_token': jwtToken
                }
            }
            return await commonHelper.asJson(res, response);
        } catch (err) {
            return await commonHelper.asJson(res, err);
        }
    }
}