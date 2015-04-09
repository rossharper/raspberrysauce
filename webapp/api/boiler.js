var boilerControlLib = require('boilercontrol');

module.exports = {
    on: function(req, res) {
        var boilercontrol = new boilerControlLib.BoilerControl(0);
        boilercontrol.sendOnSignal();
        res.send();
    },
    off: function(req, res) {
        var boilercontrol = new boilerControlLib.BoilerControl(0);
        boilercontrol.sendOffSignal();
        res.send();
    }
}