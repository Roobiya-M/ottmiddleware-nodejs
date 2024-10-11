'use strict';

const common = require('./constant_common');
const staging = require('./constant_staging');
const prod = require('./constant_prod');

var envConst = staging;
console.log('ENV', process.env.NODE_ENV);
if ('NODE_ENV' in process.env && process.env.NODE_ENV === 'prod') {
    envConst = prod;
}

let commonConst = {
    ...common,
    ...envConst
};

module.exports = commonConst;