'use strict';

const router = require('express').Router();
const requiresAuthorizedUser = require('../auth/requiresAuthorizedUser');

router.get('/schedules', requiresAuthorizedUser(), (req, res) => {
    res.render('schedules', {
        title: 'Schedules'
    });
});

module.exports = router;
