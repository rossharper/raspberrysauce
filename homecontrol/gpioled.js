var GPIO = require('onoff').Gpio

module.exports = {
    turnLedOn: function() {
        console.log("Turn LED " + chalk.green("ON"));
        led = new GPIO(18, 'out');
        led.writeSync(1);
        led.unexport();
    }
    ,
    turnLedOff: function() {
        console.log("Turn LED " + chalk.green("OFF"));
        led = new GPIO(18, 'out');
        led.writeSync(0);
        led.unexport();
    }
    ,
    isOn: function() {
        led = new GPIO(18, 'out');
        var value = led.readSync();
        led.unexport();
        return (value == 1);
    }
}
