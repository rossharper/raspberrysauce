'use strict';

const BearerStrategy = require('passport-http-bearer');

module.exports = new BearerStrategy(
  (tokenValue, done) => {
    return done(null, false);
  }
);
