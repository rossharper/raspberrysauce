'use strict';

const jsonfile = require('jsonfile');
const fs = require('fs');

const PATH = '/var/lib/homecontrol/webapp/users/';

function ensureDataDirectoryExists(path, callback) {
  fs.mkdir(path, { recursive: true }, (err) => {
    if (err) {
      if (err.code === 'EEXIST') callback(null); // ignore the error if the folder already exists
      else callback(err); // something else went wrong
    } else callback(null); // successfully created folder
  });
}

module.exports = {
  addUser: function (user, cb) {
    ensureDataDirectoryExists(PATH, (err) => {
      if (err) {
        cb(err);
      } else {
        jsonfile.writeFile(PATH + user.username, user, (err) => {
          cb(err);
        });
      }
    });
    jsonfile.writeFile(PATH + user.username, user, (err) => {
      cb(err);
    });
  },

  findUser: function (username, cb) {
    jsonfile.readFile(PATH + username, (err, user) => {
      if (err && err.code === 'ENOENT') cb(null, null);
      cb(err, user);
    });
  }
};
