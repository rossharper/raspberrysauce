'use strict';

const sinon = require('sinon');
const http = require('http');
const https = require('https');
const server = require('../../servers/server');
const path = require('path');
const fs = require('fs');
const supertest = require('supertest');
const assert = require('assert');

const FIXTURE_PATH = path.join(__dirname, 'fixtures');
const CERT_FIXTURE_PATH = path.join(FIXTURE_PATH, 'servercert.pem');
const KEY_FIXTURE_PATH = path.join(FIXTURE_PATH, 'serverkey.pem');
const CA_PATH = path.join(FIXTURE_PATH, 'cas');

const sandbox = sinon.sandbox.create();

const app = {};

function mockServer() {
  return {
    port: 9999,
    address: function () {
      return {
        port: this.port
      };
    },
    listen: function (port, cb) {
      this.port = port;
      cb();
      return this;
    },
    on: function () {},
    close: function () {}
  };
}
const mockHttpServer = mockServer();
const mockHttpsServer = mockServer();

let serverInstance;

function stubFsForDefaultCerts() {
  sandbox.stub(fs, 'readFileSync').withArgs(path.join(process.cwd(), 'certs', 'serverkey.pem')).returns('defaultkey');
  fs.readFileSync.withArgs(path.join(process.cwd(), 'certs', 'servercert.pem')).returns('defaultcert');
}

describe('server', () => {

  describe('unsecured server', () => {

    beforeEach(() => {
      sandbox.stub(http, 'createServer').returns(mockHttpServer);
      sandbox.stub(https, 'createServer').returns(mockHttpsServer);
      sandbox.spy(mockHttpServer, 'listen');
    });

    afterEach(() => {
      sandbox.restore();
    });

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
      sinon.assert.calledWith(mockHttpServer.listen, sinon.match(8080));
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
      sinon.assert.calledWith(mockHttpServer.listen, sandbox.match(port));
      done();
    });
  });

  describe('secured server', () => {

    beforeEach(() => {
      sandbox.stub(http, 'createServer').returns(mockHttpServer);
      sandbox.stub(https, 'createServer').returns(mockHttpsServer);
      sandbox.spy(mockHttpsServer, 'listen');
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('creates an HTTPS server on port 4443 with supplied application and defaults', (done) => {
      const expectedOptions = {
        key: 'defaultkey',
        cert: 'defaultcert',
        passphrase: ''
      };
      stubFsForDefaultCerts();

      server.start(app);

      sinon.assert.calledWith(https.createServer, sandbox.match(expectedOptions), sandbox.match(app));
      sinon.assert.calledWith(mockHttpsServer.listen, sinon.match(4443));
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
      sinon.assert.calledWith(mockHttpsServer.listen, sinon.match(6969));
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
        ca: 'ca',
        crl: 'tlscrl'
      };

      server.start(app, {
        securedServer: {
          tlsOptions: {
            cert: 'tlscert',
            key: 'tlskey',
            passphrase: 'tlspassphrase',
            ca: 'ca',
            crl: 'tlscrl'
          }
        }
      });

      sinon.assert.calledWith(https.createServer, sandbox.match(expectedOptions), sandbox.match(app));
      done();
    });

    it('should override tlsServer options with simple cert options', (done) => {
      const expectedOptions = {
        ca: [
          fs.readFileSync(path.join(CA_PATH, 'ca1.pem')),
          fs.readFileSync(path.join(CA_PATH, 'ca2.pem'))
        ],
        cert: fs.readFileSync(CERT_FIXTURE_PATH),
        key: fs.readFileSync(KEY_FIXTURE_PATH),
        passphrase: 'passphrase'
      };

      server.start(app, {
        securedServer: {
          serverCertPath: CERT_FIXTURE_PATH,
          serverKeyPath: KEY_FIXTURE_PATH,
          passphrase: 'passphrase',
          caPath: CA_PATH,
          tlsOptions: {
            cert: 'tlscert',
            key: 'tlskey',
            passphrase: 'tlspassphrase',
            ca: 'ca'
          }
        }
      });

      sinon.assert.calledWith(https.createServer, sandbox.match(expectedOptions), sandbox.match(app));
      done();
    });

  });

  describe('HTTP -> HTTPS redirecting server', () => {

    beforeEach(() => {
      sandbox.spy(http, 'createServer');
      sandbox.stub(https, 'createServer').returns(mockHttpsServer);
      sandbox.spy(mockHttpsServer, 'listen');
    });

    afterEach(() => {
      serverInstance.close();
      sandbox.restore();
    });

    it('should redirect HTTP traffic to the HTTPS server on default ports', (done) => {
      stubFsForDefaultCerts();

      serverInstance = server.start(app, {
        unsecuredServer: {
          redirectsToSecuredServer: true,
          enabled: true
        }
      });

      sinon.assert.calledWith(https.createServer, sandbox.match(app));
      sinon.assert.calledWith(mockHttpsServer.listen, sinon.match(4443));
      sinon.assert.neverCalledWith(http.createServer, sandbox.match(app));
      sinon.assert.called(http.createServer);

      const request = supertest('http://localhost:8080');
      request.get('/')
        .expect(302)
        .expect('Location', 'https://localhost:4443/')
        .end((err) => {
          assert.ifError(err);
          done();
        });
    });

    it('should redirect HTTP traffic to the HTTPS server with correct path', (done) => {
      stubFsForDefaultCerts();

      serverInstance = server.start(app, {
        unsecuredServer: {
          redirectsToSecuredServer: true,
          enabled: true
        }
      });

      const request = supertest('http://localhost:8080/home');
      request.get('/')
        .expect(302)
        .expect('Location', 'https://localhost:4443/home/')
        .end((err) => {
          assert.ifError(err);
          done();
        });
    });

    it('should redirect HTTP traffic to HTTPS server using defined ports', (done) => {
      stubFsForDefaultCerts();

      serverInstance = server.start(app, {
        unsecuredServer: {
          redirectsToSecuredServer: true,
          enabled: true,
          port: 7080
        },
        securedServer: {
          port: 7443
        }
      });

      sinon.assert.calledWith(https.createServer, sandbox.match(app));
      sinon.assert.calledWith(mockHttpsServer.listen, sinon.match(7443));
      sinon.assert.neverCalledWith(http.createServer, sandbox.match(app));
      sinon.assert.called(http.createServer);

      const request = supertest('http://localhost:7080');
      request.get('/')
        .expect(302)
        .expect('Location', 'https://localhost:7443/')
        .end((err) => {
          assert.ifError(err);
          done();
        });
    });
  });

  describe('running HTTPS & HTTP servers in parallel', () => {
    beforeEach(() => {
      sandbox.stub(http, 'createServer').returns(mockHttpServer);
      sandbox.stub(https, 'createServer').returns(mockHttpsServer);
      sandbox.spy(mockHttpServer, 'listen');
      sandbox.spy(mockHttpsServer, 'listen');
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('should allow running HTTP and HTTPS servers in parallel on different ports', (done) => {
      stubFsForDefaultCerts();

      server.start(app, {
        unsecuredServer: {
          enabled: true,
          port: 7080
        },
        securedServer: {
          port: 7443
        }
      });

      sinon.assert.calledWith(http.createServer, sandbox.match(app));
      sinon.assert.calledWith(https.createServer, sandbox.match(app));
      sinon.assert.calledWith(mockHttpServer.listen, sinon.match(7080));
      sinon.assert.calledWith(mockHttpsServer.listen, sinon.match(7443));
      done();
    });
  });

  describe('closing server', () => {
    beforeEach(() => {
      sandbox.stub(http, 'createServer').returns(mockHttpServer);
      sandbox.stub(https, 'createServer').returns(mockHttpsServer);
      sandbox.spy(mockHttpServer, 'close');
      sandbox.spy(mockHttpsServer, 'close');
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('can close the unsecuredServer', (done) => {
      server.start(app, {
        unsecuredServer: {
          enabled: true
        },
        securedServer: {
          enabled: false
        }
      }).close();

      sinon.assert.calledWith(mockHttpServer.close);
      done();
    });

    it('can close the securedServer', (done) => {
      stubFsForDefaultCerts();

      server.start(app, {
        unsecuredServer: {
          enabled: false
        }
      }).close();

      sinon.assert.calledWith(mockHttpsServer.close);
      done();
    });

    it('can close both secure and unsecure servers', (done) => {
      stubFsForDefaultCerts();

      server.start(app, {
        unsecuredServer: {
          enabled: true
        }
      }).close();

      sinon.assert.calledWith(mockHttpServer.close);
      sinon.assert.calledWith(mockHttpsServer.close);
      done();
    });

    it('can close both secure and redirecting servers', (done) => {
      stubFsForDefaultCerts();

      server.start(app, {
        unsecuredServer: {
          enabled: true,
          redirectsToSecuredServer: true
        }
      }).close();

      sinon.assert.calledWith(mockHttpServer.close);
      sinon.assert.calledWith(mockHttpsServer.close);
      done();
    });
  });
});
