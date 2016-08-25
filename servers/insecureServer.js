'use strict';

const http = require('http');
const _ = require('lodash');

const DEFAULT_PORT = 8080;

module.exports = {
  start: function (app, opts) {
    const port = _.get(opts, "port", DEFAULT_PORT);
    http.createServer(app).listen(port);
  }
};
