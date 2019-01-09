'use strict';

const pass = require('pwd');

module.exports = (checkPassword, salt, correctPassword, done) => {
  pass.hash(checkPassword, salt, (err, hash) => {
    if (err) {
      return done(err, false);
    }
    if (correctPassword === hash) {
      done(null, true);
    } else {
      return done(null, false);
    }
  });
};
