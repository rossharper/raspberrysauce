'use strict';

const router = require('express').Router();
const temperatureapi = require('../api/temperature');
const requiresApiAuthorization = require('../auth/requiresApiAuthorization');

router.get('/api/temperature/currentTemperature', requiresApiAuthorization(), temperatureapi.getCurrentTemperature);

module.exports = router;
