var https = require('https'),
    sslrootcas = require('ssl-root-cas'),
    fs = require('fs'),
    path = require('path');

// Config file - don't store in repo
var sslConfig = require('./config/sslconfig');

function configureRootCerts() {
    sslrootcas
        .inject()
        .addFile(path.join(sslConfig.cacertpath, sslConfig.cacert));
}

function getSslServerOptions() {
    var options = {
        key: fs.readFileSync(path.join(sslConfig.servercertpath, sslConfig.serverkey)),
        cert: fs.readFileSync(path.join(sslConfig.servercertpath, sslConfig.servercert)),
        passphrase: sslConfig.passphrase
    };
    return options;
}

function configureSslServer(app, port) {
    configureRootCerts();
    
    var server = https.createServer(getSslServerOptions(), app).listen(port, function() {
        port = server.address().port;
        console.log('Listening on https://' + server.address().address + ':' + port);
    });
}

module.exports = {
    start: function(app, port) {
        configureSslServer(app, port);
    }
};