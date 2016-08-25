'use strict';

const router = require('express').Router();
const homeviewapi = require('../api/views/home');

router.get('/api/views/home', homeviewapi.getView);

module.exports = router;
