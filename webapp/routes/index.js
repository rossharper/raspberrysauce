var express = require('express')

var
    scheduleapi = require('../api/schedule'),
    programmeapi = require('../api/programme'),
    homeviewapi = require('../api/views/home');

var router = express.Router();

function initRoutes() {

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
