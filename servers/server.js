'use strict';

const insecureServer = require('./insecureServer');

module.exports = {
  start: function (app, opts) {
    insecureServer.start(app, opts);
  }
};
