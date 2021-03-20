'use strict';

const router = require('express').Router();
const settingsviewapi = require('../api/views/settings');
const requiresApiAuthorization = require('../auth/requiresApiAuthorization');
const auth = require('../auth/Authentication');

router.get('/api/views/ios/settings', auth.getBearerHandler(), settingsviewapi.getView);

module.exports = router;
