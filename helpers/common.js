'use strict';

const bcrypt = require('bcrypt');
const { v1: uuidv1 } = require('uuid');
const fs = require('fs');
const moment = require('moment');
const path = require('path');

const sequelize = require('../db/models/index').sequelize;
const initModels = require('../db/models/init-models');
const models = initModels(sequelize);
const constantHelper = require('../config/constant');
const { errorWithCode } = require('../config/errorcode');
const crypto = require('crypto');

module.exports = {
    apiUserauthorization: (username, password) => {
        return new Promise(async (resolve, reject) => {
            try {
                console.log('API Username---', username);
                console.log('API Password---', password);
                let user = await userModel.getByUsername(username);
                await module.exports.comparePasswordHash(password, user.password_hash);
                console.log('Auth user', JSON.stringify(user));
                resolve(user);
            } catch(err) {
                console.log('Auth error', JSON.stringify(err));
                reject(err);
            }
        })
    },
    methodNotAllowed: (req, res) => {
        res.status(405);
        let response = {
            'status': 405,
            'error': 'Method not allowed'
        };
        return res.send(response);
    },
    /**
     * Generate password hash for user and customer
     * @param {*} password Password which we convert to hash
     */
     generatePasswordHash: (password) => {
        return new Promise(async (resolve, reject) => {
            try {
                let salt = await bcrypt.genSalt(constantHelper.SALT_ROUND);
                let hash = await bcrypt.hash(password, salt);
                resolve(hash);
            } catch(err) {
                reject(err);
            }
        })
    },
    /**
     * Compare password hash for against password string
     * @param {*} password Password string
     * @param {*} passwordHash Password hash retrieved 
     */
    comparePasswordHash: (password, passwordHash) => {
        return new Promise(async (resolve, reject) => {
            try {
                let match = await bcrypt.compare(password, passwordHash);
                if(match){
                    resolve(match);
                } else {
                    let response = await errorWithCode(1004);
                    reject(response);
                }
            } catch(err) {
                reject(err);
            }
        })
    },
    checkRequiredParam: (request, params) => {
        return new Promise(async (resolve, reject) => {
            for (let index = 0; index < params.length; index++) {
                let param = params[index];
                if (!(param in request)) {
                    let response = await errorWithCode(1001);
                    return reject(response);
                }
            } 
            resolve(true);
        })
    },
    isJsonString: (json) => {
        try {
            JSON.parse(json);
            return true;
        } catch (e) {
            console.log(JSON.stringify(e));
            return false;
        }
    },
    generateKey: () => {
        return new Promise(async (resolve, reject) => {
            try {
                resolve(uuidv1());
            } catch (err) {
                console.log('generateKey Error', JSON.stringify(err));
                let response = await errorWithCode();
                reject(response);
            }
        });
    },
    customLog: async (msg, fileName = constantHelper.LOG_FILE_COMMON) => {
        console.log(msg);
        fileName = `${fileName}_${moment().format('YYYY-MM-DD')}.txt`;
        let filePath = `/tmp/${fileName}`;
        fs.appendFileSync(filePath, `\r\n${moment().format('HH:mm:ss')}: ${msg}`, 'utf8');
        return true;
    },
    asJson: async(res, result) => {
        let response = {
            'status': constantHelper.STATUS_SUCCESS,
            'message': result.message,
            'data': result.data
        }

        if (result.errorcode) {
            response = {
                'status': constantHelper.STATUS_FAILED,
                'message': result.message,
                'errorcode': result.errorcode
            }
        }

        res.send(response);
    },
    getModelName: (aggregator) => {
        return new Promise(async (resolve, reject) => {
            let modelName = '';
            switch (aggregator) {
                case constantHelper.AGGREGATOR_H8:
                    modelName = models.activation_h8;
                    break;
                case constantHelper.AGGREGATOR_PLAYFIX:
                case constantHelper.AGGREGATOR_CABLEGUY:
                case constantHelper.AGGREGATOR_OTTPLAY:
                    modelName = models.activation_flixjini;
                    break;
                default:
                    let response = await errorWithCode();
                    return reject(response);
            }

            resolve(modelName);
        })
    },
    generateRandomString: (length = 8) => {
        var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        var result = '';
        length = length - 4;
        for ( var i = 0; i < length; i++ ) {
            result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
        }
        return result;
    },
    createHash256: (content) => {
        return new Promise(async (resolve, reject) => {
            try {
                let  hash = await crypto.createHash('sha256');
                //passing the data to be hashed
                let data = hash.update(content);
                //Creating the hash in the required format
                let gen_hash= data.digest('hex');
                resolve(gen_hash);
            } catch(err) {
                reject(err);
            }
        })
    },
}