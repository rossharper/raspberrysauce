'use strict';

const router = require('express').Router();
const auth = require('../auth/Authentication');
const verifyUser = require('../auth/verifyUser');
const Joi = require('joi');
const tokenRepository = require('../auth/tokenRepository');

var schema = Joi.object().keys({
  username: Joi.string().min(1).max(255).required(),
  password: Joi.string().min(1).max(255).required()
});

router.post('/requestAppToken', (req, res) => {
  Joi.validate(req.body, schema, (err, body) => {
    if(err) {
      res.status(400);
      res.end();
      return;
    }

    verifyUser(body.username, body.password, (err, user) => {
      if(err || !user) {
        res.status(401);
        res.end();
      }
      else {
        const token = tokenRepository.createToken(body.username);
        res.send(token.token);
      }
    });
  });
});

module.exports = router;
