'use strict';

module.exports = {
    REDIS_HOST: 'localhost',
    REDIS_PORT: '6379',
    REDIS_PASSWORD: '',

    AWS_SDK_KEY: 'aws_sdk_key',
    AWS_SDK_SECRET: 'aws_sdk_secret',
    AWS_SDK_REGION: 'ap-south-1',

    //H8 Details
    H8_SYSTEM_ID: 'ONEDLkl_LCO', 
    H8_SYSTEM_PASSWORD: 'password',
    H8_SYSTEM_USERNAME: 'username',
    H8_API_BASE_URL: 'https://apibaseurl.co.in',
    H8_API_RENEW_URI: 'api/PlanRecharge.asmx/PlanRenewalWithPayment',
    H8_FAILED_MAIL_IDS: ['abc@example.com', 'abc001@example.com'],

    //Playfix Details
    PLAYFIX_API_BASE_URL:  'https://baseurl/lco/activate',
    
    //CableGuy Sabot Details
    CABLEGUY_API_BASE_URL: 'http://cableguyurl/api',
    CABLEGUY_API_ACTIVATION_URI: '/sabot_api',
    CABLEGUY_API_ADD_CUSTOMER_URI: '/subscriber/add',
    FAILED_MAIL_IDS: ['abc@example.com', 'abc001@example.com'],
    CABLEGUY_LOGIN_ID: 'Mukund',
    CABLEGUY_LCOCODE: '10080',
    CABLEGUY_API_TOKEN: 'd8b702c8f04e789986d16180be55308cc0963e',
    
    //OTTPlay Details
    OTTPLAY_API_BASE_URL: 'https://.ottplay.com/',
    OTTPLAY_API_ACTIVATION_URI: 'api/v4.4/web/isp/create-subscription',
    OTTPLAY_PARTNER_REFERENECE_ID: 'ISP_3244-andh34j3ndj35r3f',
    OTTPLAY_PARTNER_ID: 'ISP_3244',
    OTTPLAY_SECRET_KEY_STAGING: '95c4-b058-affc-5fc606-c057f2e-a1s2d3f4g5',

    //Flixjini Details
    FLIXJINI_API_BASE_URL: 'https://apiurl.com',
    FLIXJINI_API_ACTIVATION_URI: '/flixjini_solutions/activate/partner/',
    FLIXJINI_PARTNER_ID: '4',
    FLIXJINI_API_USER_ID: 's7bNAQeRRJ46mCNjXbeKbMsfTnkN5c',
    FLIXJINI_ACTIVATION_API_SECRET: 'mag3b8cHkYk3ayDN95BtPJAbGgPumDG2Q3sRVvUNYNyT9ZVCDW'
} 