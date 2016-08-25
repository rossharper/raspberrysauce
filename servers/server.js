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

function getUnsecuredServerConfig(opts) {
  return _.get(opts, 'unsecuredServer', {
    enabled: false
  });
}

function getSecureServerConfig(opts) {
  const secureOptions = _.get(opts, 'securedServer', {});
  if (_.isNil(secureOptions.enabled)) secureOptions.enabled = true;
  return secureOptions;
}

function start(app, opts) {
  const unsecuredServerConfig = getUnsecuredServerConfig(opts);
  const secureServerConfig = getSecureServerConfig(opts);

  if (secureServerConfig.enabled) {
    startSecuredServer(app, secureServerConfig);
  }
  if (unsecuredServerConfig.enabled) {
    startUnsecuredServer(app, unsecuredServerConfig);
  }
}

module.exports = {
  start: start
};
