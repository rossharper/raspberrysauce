'use strict';

const router = require('express').Router();
const programmeapi = require('../api/programme');
//const requiresApiAuthorization = require('../auth/requiresApiAuthorization');
const auth = require('../auth/Authentication');

router.get('/api/programme/comfortSetPoint/', auth.getBearerHandler(), programmeapi.getComfortSetPoint);

router.post('/api/programme/comfortSetPoint/', auth.getBearerHandler(), programmeapi.setComfortSetPoint);

module.exports = router;
