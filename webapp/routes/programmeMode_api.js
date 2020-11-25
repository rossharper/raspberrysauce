'use strict';

const router = require('express').Router();
const programmeapi = require('../api/programme');
const requiresApiAuthorization = require('../auth/requiresApiAuthorization');
const auth = require('../auth/Authentication');

// TODO: should be POST/PUT really - make it RESTful!
router.get('/api/programme/setMode/auto', requiresApiAuthorization(), programmeapi.setHeatingModeAuto);
router.get('/api/programme/setMode/heatingOff', requiresApiAuthorization(), programmeapi.setHeatingModeOff);
router.get('/api/programme/setMode/comfort/:until?', requiresApiAuthorization(), programmeapi.setComfortMode);
router.get('/api/programme/setMode/setback/:until?', requiresApiAuthorization(), programmeapi.setSetbackMode);

router.post('/api/programme/setMode/auto', auth.getBearerHandler(), programmeapi.setHeatingModeAuto);
router.post('/api/programme/setMode/heatingOff', auth.getBearerHandler(), programmeapi.setHeatingModeOff);
router.post('/api/programme/setMode/comfort', auth.getBearerHandler(), programmeapi.setComfortMode);
router.post('/api/programme/setMode/setback', auth.getBearerHandler(), programmeapi.setSetbackMode);

router.get('/api/programme/getMode', auth.getBearerHandler(), programmeapi.getHeatingMode);

module.exports = router;
