'use strict';

const express = require('express');
const router = express.Router();

const partnerController = require('../controllers/partner');
const commonHelper = require('../helpers/common');

router.route('/login')
    .post(partnerController.login)
    .all(commonHelper.methodNotAllowed);;

module.exports = router;