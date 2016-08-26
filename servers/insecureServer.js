'use strict';

const http = require('http');
const _ = require('lodash');

const DEFAULT_PORT = 8080;

module.exports = {
  start: function (app, opts) {
    const port = _.get(opts, 'port', DEFAULT_PORT);
    const server = http.createServer(app);
    server.listen(port, () => {
      const listeningPort = server.address().port;
      console.log('Listening on http://' + server.address().address + ':' + listeningPort);
    });
    return {
      close: function () {
        server.close();
      }
    };
  }
};
