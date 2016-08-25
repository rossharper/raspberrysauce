'use strict';

const app = require('./webapp/app');

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
    require('./servers/SecureServer').start(app.create(), securePort);
    require('./servers/RedirectingInsecureServer').start({
      port: insecurePort
    });
  }
}

parseArgs();
start();
