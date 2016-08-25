'use strict';

const router = require('express').Router();
const scheduleapi = require('../api/schedule');
const requiresApiAuthorization = require('../auth/requiresApiAuthorization');

router.get('/api/schedule/all', requiresApiAuthorization(), scheduleapi.getSchedules);
router.post('/api/schedule/add', requiresApiAuthorization(), scheduleapi.addSchedule);

module.exports = router;
