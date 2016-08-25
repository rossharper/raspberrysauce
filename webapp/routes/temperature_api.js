'use strict';

const router = require('express').Router();
const temperatureapi = require('../api/temperature');

router.get('/api/temperature/currentTemperature', temperatureapi.getCurrentTemperature);
router.get('/api/temperature/history', temperatureapi.getHistory);
router.post('/api/temperature/add', temperatureapi.addTemperatureReading);
router.delete('/api/temperature/devTemps', temperatureapi.removeDevTemps);

module.exports = router;
