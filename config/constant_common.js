'use strict';

module.exports = {
    SALT_ROUND: 10,
    JWT_TOKEN: 'OTThDFBoL9kF2MPM',
    DB_DATETIME_FORMAT: 'YYYY-MM-DD HH:mm:ss',

    S3_BUCKET_NAME: 'ottMiddle_ware',
    MAIL_SENDER: 'noreply.incablenet@mobiotiss.com',

    ACTIVATION_TYPE_NEW: 'NEW',
    ACTIVATION_TYPE_RENEW: 'RENEW',

    ACTIVATON_STATUS_PENDING: 'PENDING',
    ACTIVATON_STATUS_SUCCESS: 'ACTIVE',
    ACTIVATON_STATUS_FAILED: 'FAILED',

    USER_STATUS_ACTIVE: 'ACTIVE',
    USER_STATUS_INACTIVE: 'INACTIVE',

    USER_TYPE_API: 'API',
    USER_TYPE_ADMIN: 'ADMIN',
    USER_TYPE_SUBUSER: 'SUBUSER',

    STATUS_FAILED: 'FAILED',
    STATUS_SUCCESS: 'SUCCESS',
    
    CURL_EXECUTION_TIMEOUT: 40000,

    SMS_USERNAME: 'nxtapi.trans',
    SMS_PASSWORD: 'sPHbh',
    SMS_URL: 'https://sms.myconnectloge.in/fe/api/v1/send',
    SMS_FROM_ID: 'NXTDGT',

    AGGREGATOR_H8: 'H8',

    LOG_FILE_COMMON: 'common',
    LOG_FILE_ACTIVATION_H8: 'activation_h8',

    LOG_FILE_ACTIVATION_PLAYFIX: 'activation_playfix',
    LOG_FILE_ACTIVATION_CABLEGUY: 'activation_cableguy',

    AGGREGATOR_PLAYFIX: 'PLAYFIX',
    AGGREGATOR_CABLEGUY: 'CABLEGUY',
    AGGREGATOR_OTTPLAY: 'OTTPLAY',

    SMS_OTT_ACTIVATIONSUCCESS_FORMAT: 'Dear Customer, Thank you for subscribing to NXTPLAY. Click https://bit.ly/NXTPlay to download & experience OTT Entertainment Ka Dhabang Dhamaka.NXTDIGITAL',

    BASE_OTT_ONEDIGITAL_PLANCODE_PREFIX: 'BSTCO'
}