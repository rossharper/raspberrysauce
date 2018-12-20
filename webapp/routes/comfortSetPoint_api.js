'use strict';

const router = require('express').Router();
const programmeapi = require('../api/programme');
const auth = require('../auth/Authentication');
const bodyParser = require('body-parser');

router.get('/api/programme/comfortSetPoint/', auth.getBearerHandler(), programmeapi.getComfortSetPoint);

router.post('/api/programme/comfortSetPoint/', auth.getBearerHandler(), bodyParser.text(), programmeapi.setComfortSetPoint);

module.exports = router;
