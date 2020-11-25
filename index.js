'use strict';

const app = require('./webapp/app');
const sslConfig = require('./servers/config/sslconfig');
const path = require('path');
const server = require('simplehttps');
const DEFAULTS = require('./defaults');

const securePort = 4443;
const insecurePort = 8080;


function usage() {
  console.log('Usage: ');
  console.log('  node index.js [-i] [-sensorpath <SENSOR_DATA_PATH>]');
  console.log('       [-programme <PROGRAMME_DATA_PATH>] [-path <WEBAPP_DATA_PATH>]');
  console.log('');
  console.log('         -i    serve over HTTP instead of HTTPS');
  console.log('-sensorpath    path at which temperature sensor readings can be read');
  console.log(' -programme    path at which programme/schedule data can be found');
  console.log(' -path         path at which the webapp should store its data')
  process.exit();
}

function parseArgs() {
  const args = {
    serveInsecure: DEFAULTS.SERVE_INSECURE,
    sensorDataPath: DEFAULTS.SENSOR_DATA_PATH,
    programmeDataPath: DEFAULTS.PROGRAMME_DATA_PATH,
    webappDataPath: DEFAULTS.WEBAPP_DATA_PATH
  };

  let argi = 2;

  function hasArg(arg) {
    return process.argv[argi] === arg;
  }

  function readArgValue() {
    return process.argv[++argi] || usage();
  }

  for (; argi < process.argv.length; argi++) {
    if (hasArg('-i') && process.env.NODE_ENV !== 'production') {
      args.serveInsecure = true;
    } else if (hasArg('-sensorpath')) {
      args.sensorDataPath = readArgValue();
    } else if (hasArg('-programme')) {
      args.programmeDataPath = readArgValue();
    } else if (hasArg('-path')) {
      args.webappDataPath = readArgValue();
    } else {
      usage();
    }
  }

  return args;
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
  const args = parseArgs();
  if (args.serveInsecure) {
    server.start(app.create(args), {
      unsecuredServer: {
        enabled: true,
        port: insecurePort,
        redirectsToSecuredServer: false
      },
      securedServer: {
        enabled: false
      }
    });
  } else {
    server.start(app.create(args), {
      unsecuredServer: {
        port: insecurePort,
        redirectPort: 443
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

start();
