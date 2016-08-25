'use strict';

const router = require('express').Router();
const batteryapi = require('../api/battery');

router.get('/api/battery/currentVoltage', batteryapi.getCurrentVoltage);
router.get('/api/battery/history', batteryapi.getHistory);

module.exports = router;
