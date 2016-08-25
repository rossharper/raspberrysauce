var express = require('express')

var
    scheduleapi = require('../api/schedule'),

    homeviewapi = require('../api/views/home');

var router = express.Router();

function initRoutes() {



    router.get('/api/schedule/all', scheduleapi.getSchedules);
    router.post('/api/schedule/add', scheduleapi.addSchedule);

    router.get('/api/views/home', homeviewapi.getView);
}

initRoutes();

module.exports = router;
