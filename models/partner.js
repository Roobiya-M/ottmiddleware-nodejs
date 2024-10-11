'use strict';

const {Op} = require('sequelize');

const sequelize = require('../db/models/index').sequelize;
const initModels = require('../db/models/init-models');
const models = initModels(sequelize);
const partnerModel = models.partner;
const constantHelper = require('../config/constant');
const { errorWithCode } = require('../config/errorcode');


module.exports = {
    getByUsername: (username) => {
        return new Promise(async (resolve, reject) => {
            try {
                let user = await partnerModel.findOne({
                    where: {
                        'username': username
                    }
                });

                console.log(user);
                if (!user) {
                    let response = await errorWithCode(1003);
                    return reject(response);
                }
                resolve(user);
            } catch (err) {
                console.log(JSON.stringify(err));
                let response = await errorWithCode();
                reject(response);
            }
        })
    }
}