'use strict';

const router = require('express').Router();
const requiresAuthorizedUser = require('../auth/requiresAuthorizedUser');
const inviteUser = require('../auth/inviteUser').inviteUser;
const Joi = require('joi');
const bodyParser = require('body-parser');

var schema = Joi.object().keys({
  email: Joi.string().email().required()
});

router.get('/invite', requiresAuthorizedUser(), (req, res) => {
  res.render('invite', {
    title: 'Invite New User',
    error: req.flash('error'),
    success: req.flash('success')
  });
});

router.post('/invite', requiresAuthorizedUser(), bodyParser.text(), (req, res) => {
  Joi.validate(req.body, schema, (err, email) => {
    if (err) {
      req.flash('error', 'Please enter a valid email address');
      res.redirect('/invite');
      return;
    } else {
      inviteUser(email, (err) => {
        if (err) {
          req.flash('error', 'The email could not be sent.');
        } else {
          req.flash('success', 'An invitation has been sent to the user.');
        }
        res.redirect('/invite');
      });
    }
  });
});

module.exports = router;
