'use strict';

const router = require('express').Router();
const temperatureapi = require('../api/temperature');
const requiresApiAuthorization = require('../auth/requiresApiAuthorization');

router.get('/api/temperature/currentTemperature', requiresApiAuthorization(), temperatureapi.getCurrentTemperature);
router.get('/api/temperature/history', requiresApiAuthorization(), temperatureapi.getHistory);
router.post('/api/temperature/add', requiresApiAuthorization(), temperatureapi.addTemperatureReading);
router.delete('/api/temperature/devTemps', requiresApiAuthorization(), temperatureapi.removeDevTemps);

module.exports = router;
