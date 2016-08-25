'use strict';

const router = require('express').Router();
const requiresAuthorizedUser = require('../auth/requiresAuthorizedUser');

router.get('/', requiresAuthorizedUser(), (req, res) => {
    res.render('index', {
        title: 'Home'
    });
});

module.exports = router;
