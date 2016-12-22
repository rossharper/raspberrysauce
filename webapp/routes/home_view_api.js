'use strict';

const router = require('express').Router();
const homeviewapi = require('../api/views/home');
const requiresApiAuthorization = require('../auth/requiresApiAuthorization');
const auth = require('../auth/Authentication');

router.get('/api/views/home', requiresApiAuthorization(), homeviewapi.getView);

router.get('/api/views/ios/home', auth.getBearerHandler(), homeviewapi.getView);

module.exports = router;
