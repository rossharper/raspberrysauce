'use strict';

const uuid = require('uuid');
const jsonfile = require('jsonfile');
const fs = require('fs');

function ensureDataDirectoryExists(path, callback) {
  fs.mkdir(path, { recursive: true }, (err) => {
    if (err) {
      if (err.code === 'EEXIST') callback(null); // ignore the error if the folder already exists
      else callback(err); // something else went wrong
    } else callback(null); // successfully created folder
  });
}

function TokenRepository(webappDataPath) {
  this.path = webappDataPath + '/tokens/'
}

function doCreateToken(path, username, expiry, cb) {
  const token = {
    username: username,
    token: uuid.v4()
  };
  if (expiry) {
    token.expiry = expiry;
  }

  ensureDataDirectoryExists(path, (err) => {
    if (err) {
      cb(err);
    } else {
      jsonfile.writeFile(path + token.token, token, (err) => {
        cb(err, token);
      });
    }
  });
}

TokenRepository.prototype = {
  createToken: function (username, cb) {
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 28);
    doCreateToken(this.path, username, expiry, cb);
  },

  createAppToken: function(appname, cb) {
    doCreateToken(this.path, appname, null, cb);
  },

  findToken: function (tokenValue, cb) {
    jsonfile.readFile(this.path + tokenValue, (err, token) => {
      if (err && err.code === 'ENOENT') {
        return cb(null, null);
      }
      cb(err, token);
    });
  },

  deleteToken: function (tokenValue, cb) {
    fs.unlink(this.path + tokenValue, cb);
  }
};

module.exports = TokenRepository;
