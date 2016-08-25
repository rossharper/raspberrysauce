'use strict';

const router = require('express').Router();
const batteryapi = require('../api/battery');
const requiresApiAuthorization = require('../auth/requiresApiAuthorization');

router.get('/api/battery/currentVoltage', requiresApiAuthorization(), batteryapi.getCurrentVoltage);
router.get('/api/battery/history', requiresApiAuthorization(), batteryapi.getHistory);

module.exports = router;
