var led = require('../../homecontrol/led');

module.exports = {
    on: function(req, res) {
        led.turnLedOn();
        res.send(led.isOn());
    },
    off: function(req, res) {
        led.turnLedOff();
        res.send(led.isOn());
    }
}