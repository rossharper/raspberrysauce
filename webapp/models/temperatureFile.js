var fs = require('fs');

function readFromFile(callback) {
    fs.readFile('/var/lib/homecontrol/sensordata/temperatureSensors/TA/value', 'utf8', function(err, contents) {
        callback("{\"temperature\":"+contents+",\"device\":\"TA\"}");
    });
}

module.exports = {
    readFromFile : readFromFile
}
