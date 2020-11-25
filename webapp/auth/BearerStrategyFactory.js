'use strict';

const BearerStrategy = require('passport-http-bearer');
const TokenRepository = require('./tokenRepository');

function BearerStrategyFactory(webappDataPath) {
  this.path = webappDataPath;
}

BearerStrategyFactory.prototype = {
  create: function() {
    const repo = new TokenRepository(this.path);
    return new BearerStrategy((tokenValue, done) => {
      repo.findToken(tokenValue, (err, token) => {
        if (err) {
          return done(err);
        }
        if (!token) {
          return done(null, false);
        }
        if (token.expiry && token.expiry <= new Date()) {
          repo.deleteToken(token, () => {
            return done(null, false);
          });
          return;
        }
        return done(null, token, {
          scope: 'all'
        });
      });
    });
  }
};

module.exports = BearerStrategyFactory;