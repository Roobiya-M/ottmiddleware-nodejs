'use strict';

const express = require('express');
const app = express();
const cors = require('cors');
const xmlParser = require('express-xml-bodyparser');
const serverless = require('serverless-http');

const jwtHelper = require('./helpers/jwt');
const commonHelper = require('./helpers/common');
const { errorWithCode } = require('./config/errorcode');

app.use(cors());
app.options('*', cors());
app.use(express.json());
app.use(xmlParser({
    normalizeTags: false,
    explicitArray: false
}));

var stageValue = '';
if ('NODE_ENV' in process.env) {
    stageValue = `/${process.env.NODE_ENV}`;
}
let baseUrl = `${stageValue}/ott/v1`;

app.use(async (req, res, next) => {
    try {
        let execuldePath = [
            `${baseUrl}/partner/login`
        ];
        let path = req.path;
        if (execuldePath.includes(path)) {
            next();
        } else {
            let token = req.headers.authorization;
            let tokenData = await jwtHelper.verifyToken(token);
            req.tokenData = tokenData;
            next();
        }
    } catch (err) {
        res.status(401);
        let response = {'errorcode': 401, 'message': 'Authorization Failed'};
        return res.send(response);
    }
})

app.use(`${baseUrl}/partner`, require('./routes/partner'));
app.use(`${baseUrl}/plan`, require('./routes/plan'));

app.listen(3500);
// module.exports.handler = serverless(app);