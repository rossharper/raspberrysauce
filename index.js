'use strict';

const app = require('./webapp/app');
const sslConfig = require('./servers/config/sslconfig');
const path = require('path');
const server = require('simplehttps');

const securePort = process.argv[2] || 4443;
const insecurePort = process.argv[3] || 8080;

let serveInsecure = false;

function parseArgs() {
  if (process.argv.indexOf('-i') !== -1) {
    serveInsecure = true;
  }
}

/*
 Config file - don't store in repo

 Format:

 sslconfig = {
    passphrase = "certificatepassword",
    cacertpath = process.env['HOME'] + "/path/to/cacerts",
    cacert = "ca_cert_name.pem",
    servercertpath = process.env['HOME'] + "/path/tp/servercert";
    servercert = "server.crt.pem";
    serverkey = "server.key.pem"
 };

*/

function start() {
  if (serveInsecure) {
    server.start(app.create(), {
      unsecuredServer: {
        enabled: true,
        port: insecurePort
      },
      securedServer: {
        enabled: false
      }
    });
  } else {
    server.start(app.create(), {
      unsecuredServer: {
        port: insecurePort
      },
      securedServer: {
        port: securePort,
        caPath: sslConfig.cacertpath,
        serverKeyPath: path.join(sslConfig.servercertpath, sslConfig.serverkey),
        serverCertPath: path.join(sslConfig.servercertpath, sslConfig.servercert),
        passphrase: sslConfig.passphrase
      }
    });
  }
}

parseArgs();
start();
