'use strict'

module.exports = {
    errorWithCode: (code) =>  {
        let error = {
            1001: 'Missing required parameter',
            1002: 'Invalid activation type',
            1003: 'Invalid Username',
            1004: 'Invalid Password',
            1005: 'Invalid Source',
            1006: 'Your account has been inactive',
            1007: 'Invalid Plan',
        };
        let finalError = {
            'errorcode': 1000,
            'message': 'Something went wrong. Please try again after sometime'
        };

        error[401] = 'Authorization Failed';

        if (code && error[code]) {
            finalError = {
                'message': error[code],
                'errorcode': code
            };
        }

        return finalError;
    }
}