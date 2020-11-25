'use strict';

const jsonfile = require('jsonfile');
const fs = require('fs');
const sanitize = require("sanitize-filename");

function ensureDataDirectoryExists(path, callback) {
  fs.mkdir(path, { recursive: true }, (err) => {
    if (err) {
      if (err.code === 'EEXIST') callback(null); // ignore the error if the folder already exists
      else callback(err); // something else went wrong
    } else callback(null); // successfully created folder
  });
}

function UserRepository(webappDataPath) {
  this.path = webappDataPath + '/users/';
}

UserRepository.prototype = {
  addUser: function (user, cb) {
    ensureDataDirectoryExists(this.path, (err) => {
      if (err) {
        cb(err);
      } else {
        jsonfile.writeFile(this.path + user.username, user, (err) => {
          cb(err);
        });
      }
    });
  },

  findUser: function (username, cb) {
    jsonfile.readFile(this.path + sanitize(username), (err, user) => {
      if (err && err.code === 'ENOENT') cb(null, null);
      cb(err, user);
    });
  }
};

module.exports = UserRepository;
