'use strict';

const router = require('express').Router();
const auth = require('../auth/Authentication');
const verifyUser = require('../auth/verifyUser');
const Joi = require('joi');

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
        res.send("CREATETOKENANDRETURNHERE");
      }
    });
  });
});

module.exports = router;
