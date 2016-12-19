'use strict';

const router = require('express').Router();
const auth = require('../auth/Authentication');
const verifyUser = require('../auth/verifyUser');
const Joi = require('joi');

const Realm = require('realm');
const uuid = require('uuid');

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

        const TokenSchema = {
          name: 'Token',
          primaryKey: 'token',
          properties: {
            username:  'string',
            token: 'string',
            expiry: {type: 'date'},
          }
        };

        let realm = new Realm({schema: [TokenSchema]});

        const token = uuid.v4();
        const expiry = new Date();
        expiry.setDate(expiry.getDate() + 28);

        realm.write(() => {
          realm.create('Token', {username: body.username, token: token, expiry: expiry});
        });

        res.send(token);
      }
    });
  });
});

module.exports = router;
