var sys = require('sys');
var exec = require('child_process').exec;
function puts(error, stdout, stderr) { console.log(stdout) }

module.exports = {
    on: function(req, res) {
        exec("callforheat 1", puts);

        res.send();
    },
    off: function(req, res) {
        exec("callforheat 0", puts);

        res.send();
    }
}