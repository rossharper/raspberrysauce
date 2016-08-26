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

function chooseFile(primaryChoicePath, secondChoiceData, thirdChoicePath) {
  if (primaryChoicePath) {
    return fs.readFileSync(primaryChoicePath);
  } else if (secondChoiceData) {
    return secondChoiceData;
  } else {
    return fs.readFileSync(thirdChoicePath);
  }
}

function choosePass(firstChoice, secondChoice, thirdChoice) {
  if (firstChoice) {
    return firstChoice;
  } else if (secondChoice) {
    return secondChoice;
  } else {
    return thirdChoice;
  }
}

function createTlsOptions(opts) {
  const options = _.get(opts, 'tlsOptions', {});
  options.key = chooseFile(opts.serverKeyPath, options.key, DEFAULT_KEY_PATH);
  options.cert = chooseFile(opts.serverCertPath, options.cert, DEFAULT_CERT_PATH);
  options.passphrase = choosePass(opts.passphrase, options.passphrase, DEFAULT_PASSPHRASE);
  if (opts.caPath) {
    options.ca = loadCaCerts(opts.caPath);
  }

  return options;
}

function configureSslServer(app, opts, cb) {
  const port = _.get(opts, 'port', DEFAULT_PORT);

  const tlsOpts = createTlsOptions(opts);

  const server = https.createServer(tlsOpts, app);
  server.listen(port, () => {
    const listeningPort = server.address().port;
    console.log('Listening on https://' + server.address().address + ':' + listeningPort);
    cb(listeningPort);
  });
  return {
    close: function () {
      server.close();
    }
  };
}

module.exports = {
  start: function (app, opts, cb) {
    return configureSslServer(app, opts, cb);
  }
};
