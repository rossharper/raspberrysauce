var express = require('express')

var temperatureapi = require('../api/temperature'),
    batteryapi = require('../api/battery'),
    scheduleapi = require('../api/schedule'),
    programmeapi = require('../api/programme'),
    homeviewapi = require('../api/views/home');

var router = express.Router();

function initRoutes() {

    router.get('/', function(req, res) {
        res.render('index', {
            title: 'Home'
        })
    });

    router.get('/schedules', function(req, res) {
        res.render('schedules', {
            title: 'Schedules'
        })
    });

    router.get('/tempgraph', function(req, res) {
        res.render('tempgraph', {
            title: 'Temperature Graph'
        })
    });

    router.get('/battgraph', function(req, res) {
        res.render('battgraph', {
            title: 'Battery Graph'
        })
    });

    router.get('/devtools', function(req, res) {
        res.render('devtools', {
            title: 'DevTools'
        })
    })

    router.get('/api/temperature/currentTemperature', temperatureapi.getCurrentTemperature);
    router.get('/api/temperature/history', temperatureapi.getHistory);
    router.post('/api/temperature/add', temperatureapi.addTemperatureReading);
    router.delete('/api/temperature/devTemps', temperatureapi.removeDevTemps);

    router.get('/api/battery/currentVoltage', batteryapi.getCurrentVoltage);
    router.get('/api/battery/history', batteryapi.getHistory);

    // TODO: should be POST/PUT really - make it RESTful!
    router.get('/api/programme/setMode/auto', programmeapi.setHeatingModeAuto);
    router.get('/api/programme/setMode/heatingOff', programmeapi.setHeatingModeOff);
    router.get('/api/programme/setMode/comfort/:until?', programmeapi.setComfortMode);
    router.get('/api/programme/setMode/setback/:until?', programmeapi.setSetbackMode);

    router.get('/api/schedule/all', scheduleapi.getSchedules);
    router.post('/api/schedule/add', scheduleapi.addSchedule);

    router.get('/api/views/home', homeviewapi.getView);
}

initRoutes();

module.exports = router;
