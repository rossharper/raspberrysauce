'use strict';

const router = require('express').Router();
const requiresAuthorizedUser = require('../auth/requiresAuthorizedUser');

router.get('/devtools', requiresAuthorizedUser(), (req, res) => {
    res.render('devtools', {
        title: 'Dev Tools'
    });
});

module.exports = router;
