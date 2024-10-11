'use strict';

const axios = require('axios').default;
const constantHelper = require('../config/constant');
const { errorWithCode } = require('../config/errorcode');

module.exports = {
    sendSMS : async (mobileNo, message) => {
        return new Promise(async (resolve, reject) => {
            let response; 
            message =encodeURIComponent(message)
            let apiUrl = constantHelper.SMS_URL+`?username=${constantHelper.SMS_USERNAME}&password=${constantHelper.SMS_PASSWORD}&unicode=false&from=${constantHelper.SMS_FROM_ID}&to=${mobileNo}&text=${message}`;
            console.log(apiUrl);
            try {
                let result = await axios.get(apiUrl);
                response = result.data;
                console.log('SMS Reponse', response);
                if (!('statusCode' in response) || response.statusCode !== '200') {
                    return reject(response);
                } 
                
                return resolve(response.transactionId);
            } catch(error) {
                console.log('error', JSON.stringify(error));
                response = await errorWithCode();
                reject(response);
            }
        });
    }
}