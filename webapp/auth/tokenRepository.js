'use strict';

const uuid = require('uuid');
const jsonfile = require('jsonfile');
const fs = require('fs');

const PATH = '/var/lib/homecontrol/webapp/tokens/';

function ensureDataDirectoryExists(path, callback) {
  fs.mkdir(path, { recursive: true }, (err) => {
    if (err) {
      if (err.code === 'EEXIST') callback(null); // ignore the error if the folder already exists
      else callback(err); // something else went wrong
    } else callback(null); // successfully created folder
  });
}

module.exports = {

  createToken: function (username, cb) {

    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 28);

    const token = {
      username: username,
      token: uuid.v4(),
      expiry: expiry
    };

    ensureDataDirectoryExists(PATH, (err) => {
      if (err) {
        cb(err);
      } else {
        jsonfile.writeFile(PATH + token.token, token, (err) => {
          cb(err, token);
        });
      }
    });
  },

  findToken: function (tokenValue, cb) {
    jsonfile.readFile(PATH + tokenValue, (err, token) => {
      if (err && err.code === 'ENOENT') {
        return cb(null, null);
      }
      cb(err, token);
    });
  },

  deleteToken: function (tokenValue, cb) {
    fs.unlink(PATH + tokenValue, cb);
  }
};
