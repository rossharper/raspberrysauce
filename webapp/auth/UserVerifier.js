'use strict';

const verifyPassword = require('./verifyPassword');

function UserVerifier(userRepository) {
  this.userRepository = userRepository;
}

UserVerifier.prototype = {
  verifyUser: function(username, password, done) {
    this.userRepository.findUser(username, (err, user) => {
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
  }
};

module.exports = UserVerifier;
