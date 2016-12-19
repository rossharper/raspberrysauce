'use strict';

const router = require('express').Router();
const auth = require('../auth/Authentication');

router.get('/tokenapitest',
  auth.getBearerHandler(),
  function(req, res) {
    res.send("token authenticated");
});

module.exports = router;
