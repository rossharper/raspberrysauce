'use strict';

const sinon = require('sinon');
const http = require('http');
const assert = require('assert');
const server = require('../../servers/server');

describe('server', () => {
  it('creates an HTTP server on port 8080 with supplied application by default', (done) => {
    const app = {};
    const mockServer = {
      listen: sinon.spy()
    };

    sinon.stub(http, 'createServer').returns(mockServer);

    server.start(app);

    assert(http.createServer.calledWith(app));
    assert(mockServer.listen.calledWith(8080));
    done();
  });
});
