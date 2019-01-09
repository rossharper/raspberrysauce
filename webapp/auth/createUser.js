'use strict';

const User = require('./user');
const userRepository = require('./userRepository');
const pass = require('pwd');

module.exports = {
  createUser: function (username, password, email, cb) {
    pass.hash(password, (err, salt, passhash) => {
      if (err) {
        cb(err);
        return;
      }
      const user = new User(username, salt, passhash, email);
      userRepository.addUser(user, (err) => {
        if (err) {
          cb(err);
          return;
        }
        cb(null, user);
      });
    });
  }
};
