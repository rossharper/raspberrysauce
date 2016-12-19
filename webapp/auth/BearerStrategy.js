'use strict';

const BearerStrategy = require('passport-http-bearer');
const tokenRepository = require('./tokenRepository');

module.exports = new BearerStrategy(
  function(token, done) {
    tokenRepository.findToken(token, function (err, token) {
      if (err) { return done(err); }
      if (!token) { return done(null, false); }
      if (token.expiry <= new Date()) {
        tokenRepository.deleteToken(token, () => {
            return done(null, false);
        });
        return;
      }
      return done(null, token, { scope: 'all' });
    });
  }
);
