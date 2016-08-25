'use strict';

const app = require('./webapp/app');
const sslConfig = require('./servers/config/sslconfig');
const path = require('path');

const securePort = process.argv[2] || 4443;
const insecurePort = process.argv[3] || 8080;

let serveInsecure = false;

function parseArgs() {
  if (process.argv.indexOf('-i') !== -1) {
    serveInsecure = true;
  }
}

function start() {
  if (serveInsecure) {
    require('./servers/insecureServer').start(app.create(), {
      port: insecurePort
    });
  } else {
    require('./servers/SecureServer').start(app.create(), {
      port: securePort,
      serverKeyPath: path.join(sslConfig.servercertpath, sslConfig.serverkey),
      serverCertPath: path.join(sslConfig.servercertpath, sslConfig.servercert),
      passphrase: sslConfig.passphrase
    });
    require('./servers/RedirectingInsecureServer').start({
      port: insecurePort
    });
  }
}

parseArgs();
start();
