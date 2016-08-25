'use strict';

const router = require('express').Router();
const programmeapi = require('../api/programme');

// TODO: should be POST/PUT really - make it RESTful!
router.get('/api/programme/setMode/auto', programmeapi.setHeatingModeAuto);
router.get('/api/programme/setMode/heatingOff', programmeapi.setHeatingModeOff);
router.get('/api/programme/setMode/comfort/:until?', programmeapi.setComfortMode);
router.get('/api/programme/setMode/setback/:until?', programmeapi.setSetbackMode);

module.exports = router;
