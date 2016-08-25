'use strict';

const router = require('express').Router();
const requiresAuthorizedUser = require('../auth/requiresAuthorizedUser');

router.get('/battgraph', requiresAuthorizedUser(), (req, res) => {
    res.render('battgraph', {
        title: 'Battery Graph'
    });
});

module.exports = router;
