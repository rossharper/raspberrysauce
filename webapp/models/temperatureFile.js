var fs = require('fs');

function readFromFile(callback) {
    fs.readFile('/var/lib/homecontrol/sensordata/temperatureSensors/TA/value', 'utf8', function(err, contents) {
        var temperature = {
            temperature: parseFloat(contents),
            device: "TA"
        }
        callback(temperature);
    });
}

module.exports = {
    readFromFile : readFromFile
}
