/*
 * Module dependencies
 */
var express = require('express'),
    morgan = require('morgan'),
    stylus = require('stylus'),
    nib = require('nib'),
    https = require('https'),
    http = require('http'),
    sslrootcas = require('ssl-root-cas'),
    fs = require('fs'),
    path = require('path');

// Config file - not in repo
var config = require('./config');

var port = process.argv[2] || 4443,
    insecurePort = process.argv[3] || 8080,
    server, insecureServer, options;

function configureRootCerts() {
    sslrootcas
        .inject()
        .addFile(path.join(__dirname, config.sslcerts.cacertpath, config.sslcerts.cacert));
}

function setSslServerOptions() {
    options = {
        key: fs.readFileSync(path.join(__dirname, config.sslcerts.servercertpath, config.sslcerts.serverkey)),
        cert: fs.readFileSync(path.join(__dirname, config.sslcerts.servercertpath, config.sslcerts.servercert)),
        passphrase: config.sslcerts.passphrase
    };
}

function stylusCompile(str, path) {
    return stylus(str)
        .set('filename', path)
        .use(nib())
}

function createApp() {
    var app = express();
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(morgan('dev'));
    app.use(stylus.middleware({
        src: __dirname + '/public',
        compile: stylusCompile
    }));
    app.use(express.static(__dirname + '/public'));

    app.get('/', function(req, res) {
        res.render('index', {
            title: 'Home'
        })
    })

    return app;
}

function configureSslServer() {
    configureRootCerts();
    setSslServerOptions();
    
    server = https.createServer(options, createApp()).listen(port, function() {
        port = server.address().port;
        console.log('Listening on https://' + server.address().address + ':' + port);
    });
}

function configureInsecureTrafficRedirect() {
    insecureServer = http.createServer();
    insecureServer.on('request', function(req, res) {
        // TODO also redirect websocket upgrades
        res.setHeader(
            'Location', 'https://' + req.headers.host.replace(/:\d+/, '') + req.url
        );
        res.statusCode = 302;
        res.end();
    });
    insecureServer.listen(insecurePort, function() {
        console.log("\nRedirecting all http traffic to https\n");
    });
}

function start() {
    configureSslServer();
    configureInsecureTrafficRedirect();
}

start();