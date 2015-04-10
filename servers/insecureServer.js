var http = require('http');

module.exports = {
    start: function(app, port) {
        http.createServer(app).listen(port);
    }
};