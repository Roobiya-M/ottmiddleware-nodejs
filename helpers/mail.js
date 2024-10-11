'use strict';

const AWS = require('aws-sdk');

const constantHelper = require('../config/constant');

const SES_CONFIG = {
    accessKeyId: constantHelper.AWS_SDK_KEY,
    secretAccessKey: constantHelper.AWS_SDK_SECRET,
    region: constantHelper.AWS_SDK_REGION
};

const AWS_SES = new AWS.SES(SES_CONFIG);

module.exports = {
    sendMail: (email, subject, message) => {
        return new Promise(async (resolve, reject) => {
            try {
                if (!Array.isArray(email)) {
                    email = [email];
                }
                let sender = constantHelper.MAIL_SENDER;
                let params = {
                    Source: sender,
                    Destination: {
                      ToAddresses: email,
                    },
                    ReplyToAddresses: [],
                    Message: {
                      Body: {
                        Html: {
                          Charset: 'UTF-8',
                          Data: message,
                        },
                      },
                      Subject: {
                        Charset: 'UTF-8',
                        Data: subject,
                      }
                    },
                };
                
                let result = await AWS_SES.sendEmail(params).promise(); 
                console.log('mailResult', result);
                resolve(result);
            } catch(err) {
                reject(err);
            }
        })
    }
}