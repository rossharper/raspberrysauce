'use strict';

const router = require('express').Router();
const requiresAuthorizedUser = require('../auth/requiresAuthorizedUser');

router.get('/invite', requiresAuthorizedUser(), (req, res) => {
  res.render('invite', {
    title: 'Invite New User'
  });
});

module.exports = router;
