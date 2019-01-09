'use strict';

const userRepository = require('./userRepository');
const verifyPassword = require('./verifyPassword');

module.exports = (username, password, done) => {
  userRepository.findUser(username, (err, user) => {
    if (err) {
      return done(err);
    }
    if (!user) {
      return done(null, false);
    }

    verifyPassword(password, user.salt, user.password, (err, verified) => {
      if (err) {
        return done(err);
      }
      if (!verified) {
        return done(null, false);
      }
      return done(null, user);
    });
  });
};
