'use strict';

const router = require('express').Router();
const bodyParser = require('body-parser');
const UserVerifier = require('../auth/UserVerifier');
const Joi = require('joi');
const TokenRepository = require('../auth/tokenRepository');
const UserRepository = require('../auth/userRepository');
const requiresApiAuthorization = require('../auth/requiresApiAuthorization');

const userAppTokenSchema = Joi.object().keys({
  username: Joi.string().min(1).max(255).required(),
  password: Joi.string().min(1).max(255).required()
});

router.post('/requestAppToken', bodyParser.urlencoded({ extended: false }), (req, res) => {
  Joi.validate(req.body, userAppTokenSchema, (err, body) => {
    if (err) {
      res.status(400);
      res.end();
      return;
    }

    const path = req.app.get('webappDataPath');

    new UserVerifier(new UserRepository(path)).verifyUser(body.username, body.password, (err, user) => {
      if (err || !user) {
        res.status(401);
        res.end();
      } else {
        new TokenRepository(path).createToken(body.username, (err, token) => {
          if (err) {
            console.log(err);
            res.status(500);
            res.end();
            return;
          }
          res.send(token.token);
        });
      }
    });
  });
});

const appTokenSchema = Joi.object().keys({
  appname: Joi.string().min(1).max(255).required()
});

router.post('/requestThirdPartyAppToken', requiresApiAuthorization(), bodyParser.urlencoded({ extended: false }), (req, res) => {
  Joi.validate(req.body, appTokenSchema, (err, body) => {
    if (err) {
      res.status(400);
      res.end();
      return;
    }

    new TokenRepository(req.app.get('webappDataPath')).createAppToken(body.appname, (err, token) => {
      if (err) {
        console.log(err);
        res.status(500);
        res.end();
        return;
      }
      res.send(token.token);
    });
  });
});

module.exports = router;
