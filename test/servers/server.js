'use strict';

const sinon = require('sinon');
const http = require('http');
const assert = require('assert');
const server = require('../../servers/server');

var sandbox = sinon.sandbox.create();

describe('server', () => {

  afterEach(() => {
    sandbox.restore();
  });

  it('creates an HTTP server on port 8080 with supplied application by default', (done) => {
    const app = {};
    const mockServer = {
      listen: sandbox.spy()
    };

    sandbox.stub(http, 'createServer').returns(mockServer);

    server.start(app);

    sinon.assert.calledWith(http.createServer, sandbox.match(app));
    sinon.assert.calledWith(mockServer.listen, sinon.match(8080));
    done();
  });

  it('creates an HTTP server on specified port', (done) => {
    const app = {};
    const mockServer = {
      listen: sandbox.spy()
    };

    sandbox.stub(http, 'createServer').returns(mockServer);

    const port = 6969;
    server.start(app, {
      port: port
    });

    sinon.assert.calledWith(http.createServer, sandbox.match(app));
    sinon.assert.calledWith(mockServer.listen, sandbox.match(port));
    done();
  })
});
