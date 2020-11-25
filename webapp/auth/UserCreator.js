'use strict';

const User = require('./user');
const pass = require('pwd');

function UserCreator(userRepository) {
  this.repo = userRepository;
}

UserCreator.prototype = {
  createUser: function (username, password, email, cb) {
    pass.hash(password, (err, salt, passhash) => {
      if (err) {
        cb(err);
        return;
      }
      const user = new User(username, salt, passhash, email);
      this.repo.addUser(user, (err) => {
        if (err) {
          cb(err);
          return;
        }
        cb(null, user);
      });
    });
  }
};

module.exports = UserCreator;
