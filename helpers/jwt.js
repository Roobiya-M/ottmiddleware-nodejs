'use strict';

const jwt = require('jsonwebtoken');
const { errorWithCode } = require('../config/errorcode');
const constantHelper = require('../config/constant');

module.exports = {
    generateJwt: (data) => {
        let token = jwt.sign(data, constantHelper.JWT_TOKEN, {issuer : 'OTTMIDDLEWARE', expiresIn : '2h'});
        return token;
    },
    verifyToken: (token) => {
        return new Promise(async (resolve, reject) => {
            try {
                console.log(token);
                token = token.substring(7);
                let tokenData = jwt.verify(token, constantHelper.JWT_TOKEN);

                resolve(tokenData);
            } catch(error) {
                let response = await errorWithCode(401);
                reject(response);
            }
        });
    }
}