'use strict';

const insecureServer = require('./insecureServer');

module.exports = {
  start: function (app) {
    insecureServer.start(app);
  }
};
