'use strict';

const http = require('http');

function configureInsecureTrafficRedirect(inSecurePort) {
    const insecureServer = http.createServer();
    insecureServer.on('request', (req, res) => {
        try {
            res.setHeader(
                'Location', 'https://' + req.headers.host.replace(/:\d+/, '') + req.url
            );
            res.statusCode = 302;
            res.end();
        } catch (err) {
            console.log('ERROR: ' + err + '\nwhile serving request ' + req);
            res.statusCode = 500;
            res.end();
        }
    });
    insecureServer.listen(inSecurePort, () => {
        console.log('\nRedirecting all http traffic to https\n');
    });
}

module.exports = {
    start: function (inSecurePort) {
        configureInsecureTrafficRedirect(inSecurePort);
    }
};
