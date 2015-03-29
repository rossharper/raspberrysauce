var GPIO = require('onoff').Gpio,
    chalk = require('chalk');

var led = new GPIO(18, 'out');

module.exports = {
    turnLedOn: function() {
        console.log("Turn LED " + chalk.green("ON"));
        led = new GPIO(18, 'out');
        led.writeSync(1);
    }
    ,
    turnLedOff: function() {
        console.log("Turn LED " + chalk.green("OFF"));
        led = new GPIO(18, 'out');
        led.writeSync(0);
    }
    ,
    isOn: function() {
        var value = led.readSync();
        return (value == 1);
        return false;
    }
}
