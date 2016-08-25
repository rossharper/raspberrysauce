'use strict';

const router = require('express').Router();
const homeviewapi = require('../api/views/home');
const requiresApiAuthorization = require('../auth/requiresApiAuthorization');

router.get('/api/views/home', requiresApiAuthorization(), homeviewapi.getView);

module.exports = router;
