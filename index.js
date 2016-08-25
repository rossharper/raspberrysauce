'use strict';

const app = require('./webapp/app');
const sslConfig = require('./servers/config/sslconfig');
const path = require('path');
const secureServer = require('./servers/SecureServer');
const redirectingInsecureServer = require('./servers/RedirectingInsecureServer');
const insecureServer = require('./servers/insecureServer');

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
    insecureServer.start(app.create(), {
      port: insecurePort
    });
  } else {
    secureServer.start(app.create(), {
      port: securePort,
      caPath: sslConfig.cacertpath,
      serverKeyPath: path.join(sslConfig.servercertpath, sslConfig.serverkey),
      serverCertPath: path.join(sslConfig.servercertpath, sslConfig.servercert),
      passphrase: sslConfig.passphrase
    });
    redirectingInsecureServer.start({
      port: insecurePort
    });
  }
}

parseArgs();
start();
