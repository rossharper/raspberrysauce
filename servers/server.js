'use strict';

const _ = require('lodash');
const unsecuredServer = require('./insecureServer');
const securedServer = require('./SecureServer');

function startUnsecuredServer(app, opts) {
  unsecuredServer.start(app, opts);
}

function startSecuredServer(app, opts) {
  securedServer.start(app, opts);
}

function getSecureServerConfig(opts) {
  return _.get(opts, 'securedServer', {
    enabled: false
  });
}

function start(app, opts) {
  const secureServerConfig = getSecureServerConfig(opts);

  if (secureServerConfig.enabled) {
    startSecuredServer(app, secureServerConfig);
  }

  startUnsecuredServer(app, opts);
}

module.exports = {
  start: start
};
