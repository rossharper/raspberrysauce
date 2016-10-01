'use strict';

const router = require('express').Router();
const programmeapi = require('../api/programme');
const requiresApiAuthorization = require('../auth/requiresApiAuthorization');

// TODO: should be POST/PUT really - make it RESTful!
router.get('/api/programme/setMode/auto', requiresApiAuthorization(), programmeapi.setHeatingModeAuto);
router.get('/api/programme/setMode/heatingOff', requiresApiAuthorization(), programmeapi.setHeatingModeOff);
router.get('/api/programme/setMode/comfort/:until?', requiresApiAuthorization(), programmeapi.setComfortMode);
router.get('/api/programme/setMode/setback/:until?', requiresApiAuthorization(), programmeapi.setSetbackMode);

module.exports = router;
