'use strict';

const router = require('express').Router();

router.get('/tempgraph', (req, res) => {
    res.render('tempgraph', {
        title: 'Temperature Graph'
    });
});

module.exports = router;
