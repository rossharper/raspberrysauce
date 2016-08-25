'use strict';

const https = require('https');
const sslrootcas = require('ssl-root-cas');
const fs = require('fs');
const path = require('path');
const _ = require('lodash');

const DEFAULT_PORT = 4443;
const DEFAULT_TLS_PATH = path.join(process.cwd(), 'certs');
const DEFAULT_CERT_PATH = path.join(DEFAULT_TLS_PATH, 'servercert.pem');
const DEFAULT_KEY_PATH = path.join(DEFAULT_TLS_PATH, 'serverkey.pem');
const DEFAULT_PASSPHRASE = '';

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
const sslConfig = require('./config/sslconfig');

function configureRootCerts() {
  sslrootcas
    .inject()
    .addFile(path.join(sslConfig.cacertpath, sslConfig.cacert));
}

function createTlsOptions(opts) {
  const options = {
    key: fs.readFileSync(opts.serverKeyPath || DEFAULT_KEY_PATH),
    cert: fs.readFileSync(opts.serverCertPath || DEFAULT_CERT_PATH),
    passphrase: opts.passphrase || DEFAULT_PASSPHRASE
  };
  return options;
}

function configureSslServer(app, opts) {
  const port = _.get(opts, 'port', DEFAULT_PORT);

  configureRootCerts();
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
