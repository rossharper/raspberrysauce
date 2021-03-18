'use strict';

const router = require('express').Router();
const programmeapi = require('../api/programme');
const auth = require('../auth/Authentication');
const bodyParser = require('body-parser');

router.get('/api/programme/targettemperature/', auth.getBearerHandler(), programmeapi.getTargetTemperature)

router.post('/api/programme/targettemperature/', auth.getBearerHandler(), bodyParser.text(), programmeapi.setTargetTemperatureOverride);

module.exports = router;
