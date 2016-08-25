'use strict';

const router = require('express').Router();

router.get('/battgraph', (req, res) => {
    res.render('battgraph', {
        title: 'Battery Graph'
    });
});

module.exports = router;
