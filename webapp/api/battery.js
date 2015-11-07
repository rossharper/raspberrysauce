var Battery = require('../models/battery');

function getLatestVoltageFromDatabase(callback) {
    Battery.find().sort({date: -1}).limit(1).exec(function(err, battery) {
        if(battery && battery.length > 0) {
            callback(battery[0]);
        } else {
            callback({});
        }
    });
}

function getVoltageFromFile(callback) {
    var fs = require('fs');

    fs.readFile('/var/lib/homecontrol/sensordata/temperatureSensors/TA/batt', 'utf8', function(err, contents) {
        callback("{\"batteryVoltage\":"+contents+",\"device\":\"TA\"}");
    });
}

module.exports = {
    getCurrentVoltage: function(req, res) {
        getVoltageFromFile(function(voltage) { res.send(voltage) });
    },
    getHistory: function(req, res) {
        Battery.find().sort({date: 1}).exec(function(err, voltages) {
            res.send(voltages);
        });
    }
}
