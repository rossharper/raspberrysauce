'use strict';

const uuid = require('uuid');
const jsonfile = require('jsonfile');
const fs = require('fs');

const PATH = '/var/lib/homecontrol/webapp/tokens/';

module.exports = {

  createToken: function (username, cb) {

    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 28);

    const token = {
      username: username,
      token: uuid.v4(),
      expiry: expiry
    };

    jsonfile.writeFile(PATH + token.token, token, (err) => {
      cb(err, token);
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
