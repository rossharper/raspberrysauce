'use strict';

const https = require('https');
const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const FileHound = require('filehound');

const DEFAULT_PORT = 4443;
const DEFAULT_TLS_PATH = path.join(process.cwd(), 'certs');
const DEFAULT_CERT_PATH = path.join(DEFAULT_TLS_PATH, 'servercert.pem');
const DEFAULT_KEY_PATH = path.join(DEFAULT_TLS_PATH, 'serverkey.pem');
const DEFAULT_PASSPHRASE = '';

function loadCaCerts(caPath) {
  return FileHound.create()
    .paths(caPath)
    .ext('pem')
    .findSync()
    .map((caCertPath) => {
      return fs.readFileSync(caCertPath);
    });
}

function createTlsOptions(opts) {
  const options = {
    key: fs.readFileSync(opts.serverKeyPath || DEFAULT_KEY_PATH),
    cert: fs.readFileSync(opts.serverCertPath || DEFAULT_CERT_PATH),
    passphrase: opts.passphrase || DEFAULT_PASSPHRASE
  };
  if (opts.caPath) options.ca = loadCaCerts(opts.caPath);
  return options;
}

function configureSslServer(app, opts) {
  const port = _.get(opts, 'port', DEFAULT_PORT);

  const tlsOpts = createTlsOptions(opts);

  const server = https.createServer(tlsOpts, app).listen(port, () => {
    const listeningPort = server.address().port;
    console.log('Listening on https://' + server.address().address + ':' + listeningPort);
  });
}

module.exports = {
  start: function (app, opts) {
    configureSslServer(app, opts);
  }
};
