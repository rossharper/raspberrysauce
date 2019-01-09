'use strict';

module.exports = function (username, salt, password, email) {
  this.username = username;
  this.salt = salt;
  this.password = password;
  this.email = email;
};
