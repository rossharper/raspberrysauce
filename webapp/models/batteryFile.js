var fs = require('fs');

function readFromFile(callback) {
    fs.readFile('/var/lib/homecontrol/sensordata/temperatureSensors/TA/batt', 'utf8', function(err, contents) {
        callback("{\"batteryVoltage\":"+contents+",\"device\":\"TA\"}");
    });
}

module.exports = {
    readFromFile : readFromFile
}
