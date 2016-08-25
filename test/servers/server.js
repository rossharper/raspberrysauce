'use strict';

const sinon = require('sinon');
const http = require('http');
const https = require('https');
const server = require('../../servers/server');
const path = require('path');
const fs = require('fs');

const sandbox = sinon.sandbox.create();

const app = {};
const mockServer = {
  listen: sandbox.spy()
};

describe('server', () => {

  beforeEach(() => {
    sandbox.stub(http, 'createServer').returns(mockServer);
    sandbox.stub(https, 'createServer').returns(mockServer);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('unsecured server', () => {

    it('creates an HTTP server on port 8080 with supplied application by default', (done) => {
      server.start(app);

      sinon.assert.calledWith(http.createServer, sandbox.match(app));
      sinon.assert.calledWith(mockServer.listen, sinon.match(8080));
      done();
    });

    it('creates an HTTP server on specified port', (done) => {
      const port = 6969;
      server.start(app, {
        port: port
      });

      sinon.assert.calledWith(http.createServer, sandbox.match(app));
      sinon.assert.calledWith(mockServer.listen, sandbox.match(port));
      done();
    });
  });

  describe('secured server', () => {

    it.only('creates an HTTPS server on port 4443 with supplied application and defaults', (done) => {
      const expectedOptions = {
        key: 'keyfixture',
        cert: 'certfixture',
        passphrase: ''
      };
      sandbox.stub(fs, 'readFileSync').withArgs(path.join(process.cwd(), 'certs', 'serverkey.pem')).returns('keyfixture');
      fs.readFileSync.withArgs(path.join(process.cwd(), 'certs', 'servercert.pem')).returns('certfixture');

      server.start(app, {
        securedServer: {
          enabled: true
        }
      });

      sinon.assert.calledWith(https.createServer, sandbox.match(expectedOptions), sandbox.match(app));
      sinon.assert.calledWith(mockServer.listen, sinon.match(4443));
      done();
    });

    // TODO: it should start a secure server on the specified port when the options say so
    // TODO: tests around using the certs
    // TODO: allow passthru tls options
    // TODO: path cert options override tls options
    // TODO: tests around also starting a redirecting unsecured server
    // TODO: rename underlying module unsecured server?
  });
});
