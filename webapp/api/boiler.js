var boilerControlLib = require('boilercontrol');

var sys = require('sys');
var exec = require('child_process').exec;
function puts(error, stdout, stderr) { sys.puts(stdout) }

module.exports = {
    on: function(req, res) {
        //var boilercontrol = new boilerControlLib.BoilerControl(0);
        //boilercontrol.sendOnSignal();

        exec("callforheat 1", puts);

        res.send();
    },
    off: function(req, res) {
        //var boilercontrol = new boilerControlLib.BoilerControl(0);
        //boilercontrol.sendOffSignal();

        exec("callforheat 0", puts);

        res.send();
    }
}