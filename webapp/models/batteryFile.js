var fs = require('fs');

function readFromFile(callback) {
    fs.readFile('/var/lib/homecontrol/sensordata/temperatureSensors/TA/batt', 'utf8', function(err, contents) {
        var battery = {
            batteryVoltage: parseFloat(contents),
            device: "TA"
        };
        callback(battery);
    });
}

module.exports = {
    readFromFile : readFromFile
}
