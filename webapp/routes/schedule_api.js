'use strict';

const router = require('express').Router();
const scheduleapi = require('../api/schedule');

router.get('/api/schedule/all', scheduleapi.getSchedules);
router.post('/api/schedule/add', scheduleapi.addSchedule);

module.exports = router;
