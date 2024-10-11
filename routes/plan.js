'use strict';

const express = require('express');
const router = express.Router();

const planController = require('../controllers/plan');
const commonHelper = require('../helpers/common');

router.route('/subscribe')
    .post(planController.subscribe)
    .all(commonHelper.methodNotAllowed);;

module.exports = router;