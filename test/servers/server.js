'use strict';

const sinon = require('sinon');
const http = require('http');
const https = require('https');
const server = require('../../servers/server');
const path = require('path');
const fs = require('fs');

const FIXTURE_PATH = path.join(__dirname, 'fixtures');
const CERT_FIXTURE_PATH = path.join(FIXTURE_PATH, 'servercert.pem');
const KEY_FIXTURE_PATH = path.join(FIXTURE_PATH, 'serverkey.pem');
const CA_PATH = path.join(FIXTURE_PATH, 'cas');

const sandbox = sinon.sandbox.create();

const app = {};
const mockServer = {
  listen: sandbox.spy()
};

function stubFsForDefaultCerts() {
  sandbox.stub(fs, 'readFileSync').withArgs(path.join(process.cwd(), 'certs', 'serverkey.pem')).returns('defaultkey');
  fs.readFileSync.withArgs(path.join(process.cwd(), 'certs', 'servercert.pem')).returns('defaultcert');
}

describe('server', () => {

  beforeEach(() => {
    sandbox.stub(http, 'createServer').returns(mockServer);
    sandbox.stub(https, 'createServer').returns(mockServer);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('unsecured server', () => {

    it('does not start by default', (done) => {
      server.start(app, {
        securedServer: {
          enabled: false
        }
      });

      sinon.assert.notCalled(http.createServer);
      done();
    });

    it('creates an HTTP server on port 8080 with supplied application by default', (done) => {
      server.start(app, {
        unsecuredServer: {
          enabled: true
        },
        securedServer: {
          enabled: false
        }
      });

      sinon.assert.calledWith(http.createServer, sandbox.match(app));
      sinon.assert.calledWith(mockServer.listen, sinon.match(8080));
      done();
    });

    it('creates an HTTP server on specified port', (done) => {
      const port = 6969;
      server.start(app, {
        unsecuredServer: {
          enabled: true,
          port: port
        },
        securedServer: {
          enabled: false
        }
      });

      sinon.assert.calledWith(http.createServer, sandbox.match(app));
      sinon.assert.calledWith(mockServer.listen, sandbox.match(port));
      done();
    });
  });

  describe('secured server', () => {

    it('creates an HTTPS server on port 4443 with supplied application and defaults', (done) => {
      const expectedOptions = {
        key: 'defaultkey',
        cert: 'defaultcert',
        passphrase: ''
      };
      stubFsForDefaultCerts();

      server.start(app);

      sinon.assert.calledWith(https.createServer, sandbox.match(expectedOptions), sandbox.match(app));
      sinon.assert.calledWith(mockServer.listen, sinon.match(4443));
      done();
    });

    it('does not start an HTTPS server when disabled', (done) => {
      server.start(app, {
        securedServer: {
          enabled: false
        }
      });

      sinon.assert.notCalled(https.createServer);
      done();
    });

    it('creates an HTTPS server on the specified port', (done) => {
      stubFsForDefaultCerts();

      server.start(app, {
        securedServer: {
          port: 6969
        }
      });

      sinon.assert.calledWith(https.createServer, sandbox.match(app));
      sinon.assert.calledWith(mockServer.listen, sinon.match(6969));
      done();
    });

    it('creates an HTTPS server with specified cert, key and passphrase', (done) => {
      const expectedOptions = {
        cert: fs.readFileSync(CERT_FIXTURE_PATH),
        key: fs.readFileSync(KEY_FIXTURE_PATH),
        passphrase: 'passphrase'
      };

      server.start(app, {
        securedServer: {
          serverCertPath: CERT_FIXTURE_PATH,
          serverKeyPath: KEY_FIXTURE_PATH,
          passphrase: 'passphrase'
        }
      });

      sinon.assert.calledWith(https.createServer, sandbox.match(expectedOptions), sandbox.match(app));
      done();
    });

    // TODO: test loading root cas
    it('creates an HTTPS server with specified ca certs', (done) => {
      stubFsForDefaultCerts();

      const expectedOptions = {
        ca: [
          fs.readFileSync(path.join(CA_PATH, 'ca1.pem')),
          fs.readFileSync(path.join(CA_PATH, 'ca2.pem'))
        ]
      };

      server.start(app, {
        securedServer: {
          caPath: CA_PATH
        }
      });

      sinon.assert.calledWith(https.createServer, sandbox.match(expectedOptions), sandbox.match(app));
      done();
    });

    it('should allow tlsServer options to be passed through', (done) => {
      const expectedOptions = {
        cert: 'tlscert',
        key: 'tlskey',
        passphrase: 'tlspassphrase',
        crl: 'tlscrl'
      };

      server.start(app, {
        securedServer: {
          tlsOptions: {
            cert: 'tlscert',
            key: 'tlskey',
            passphrase: 'tlspassphrase',
            crl: 'tlscrl'
          }
        }
      });

      sinon.assert.calledWith(https.createServer, sandbox.match(expectedOptions), sandbox.match(app));
      done();
    });

    // TODO: allow passthru tls options
    // TODO: path cert options override tls options
    // TODO: tests around also starting a redirecting unsecured server
    // TODO: rename underlying module unsecured server?
  });
});
