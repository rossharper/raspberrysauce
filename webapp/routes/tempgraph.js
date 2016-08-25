'use strict';

const router = require('express').Router();
const requiresAuthorizedUser = require('../auth/requiresAuthorizedUser');

router.get('/tempgraph', requiresAuthorizedUser(), (req, res) => {
    res.render('tempgraph', {
        title: 'Temperature Graph'
    });
});

module.exports = router;
