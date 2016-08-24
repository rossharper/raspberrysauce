'use strict';

const jsonfile = require('jsonfile');

const PATH = '/var/lib/homecontrol/webapp/users/';

module.exports = {
  addUser: function (user, cb) {
    jsonfile.writeFile(PATH + user.username, user, (err) => {
      cb(err);
    });
  }
};
