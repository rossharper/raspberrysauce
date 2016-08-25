'use strict';

const router = require('express').Router();

router.get('/schedules', (req, res) => {
    res.render('schedules', {
        title: 'Schedules'
    });
});

module.exports = router;
