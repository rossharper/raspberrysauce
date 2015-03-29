var http = require('http');

function configureInsecureTrafficRedirect(inSecurePort) {
    var insecureServer = http.createServer();
    insecureServer.on('request', function(req, res) {
        // TODO also redirect websocket upgrades
        res.setHeader(
            'Location', 'https://' + req.headers.host.replace(/:\d+/, '') + req.url
        );
        res.statusCode = 302;
        res.end();
    });
    insecureServer.listen(inSecurePort, function() {
        console.log("\nRedirecting all http traffic to https\n");
    });
}

module.exports = {
    start: function(inSecurePort) {
        configureInsecureTrafficRedirect(inSecurePort);
    }
};