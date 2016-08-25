'use strict';

const router = require('express').Router();

router.get('/devtools', (req, res) => {
    res.render('devtools', {
        title: 'Dev Tools'
    });
});

module.exports = router;
