var app = require('./webapp/app'),
    secureServer = require('./servers/SecureServer'),
    inSecureRedirect = require('./servers/RedirectingInsecureServer');

var securePort = process.argv[2] || 4443,
    insecurePort = process.argv[3] || 8080;

function start() {
    secureServer.start(app.create(), securePort);
    inSecureRedirect.start(insecurePort);
}

start();