'use strict';

const router = require('express').Router();
const temperatureapi = require('../api/temperature');
const requiresApiAuthorization = require('../auth/requiresApiAuthorization');
const auth = require('../auth/Authentication');

router.get('/api/temperature/currentTemperature', requiresApiAuthorization(), temperatureapi.getCurrentTemperature);

router.get('/api/temperature/', auth.getBearerHandler(), temperatureapi.getCurrentTemperature); // DEPRECATE ENDPOINT
router.get('/api/temperature/current', auth.getBearerHandler(), temperatureapi.getCurrentTemperature);

module.exports = router;
