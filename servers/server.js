'use strict';

const _ = require('lodash');
const unsecuredServer = require('./insecureServer');
const securedServer = require('./SecureServer');
const redirectingServer = require('./RedirectingInsecureServer');

function getUnsecuredServerConfig(opts) {
  const unsecureOptions = _.get(opts, 'unsecuredServer', {});
  if (_.isNil(unsecureOptions.enabled)) unsecureOptions.enabled = true;
  if (_.isNil(unsecureOptions.redirectsToSecuredServer)) unsecureOptions.redirectsToSecuredServer = true;
  return unsecureOptions;
}

function getSecureServerConfig(opts) {
  const secureOptions = _.get(opts, 'securedServer', {});
  if (_.isNil(secureOptions.enabled)) secureOptions.enabled = true;
  return secureOptions;
}

function start(app, opts) {
  const unsecuredServerConfig = getUnsecuredServerConfig(opts);
  const secureServerConfig = getSecureServerConfig(opts);

  let unsecuredServerInstance;
  let securedServerInstance;
  let redirectingServerInstance;

  if (secureServerConfig.enabled) {
    securedServerInstance = securedServer.start(app, secureServerConfig, (port) => {
      if (unsecuredServerConfig.enabled && unsecuredServerConfig.redirectsToSecuredServer) {
        const redirectConfig = {
          securedServerPort: port
        };
        if (unsecuredServerConfig.port) redirectConfig.unSecuredServerPort = unsecuredServerConfig.port;
        redirectingServerInstance = redirectingServer.start(redirectConfig);
      }
    });
  }
  if (unsecuredServerConfig.enabled && !unsecuredServerConfig.redirectsToSecuredServer) {
    unsecuredServerInstance = unsecuredServer.start(app, unsecuredServerConfig);
  }

  return {
    close: function () {
      if (unsecuredServerInstance) unsecuredServerInstance.close();
      if (securedServerInstance) securedServerInstance.close();
      if (redirectingServerInstance) redirectingServerInstance.close();
    }
  };
}

module.exports = {
  start: start
};
