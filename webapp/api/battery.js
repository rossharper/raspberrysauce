var Battery = require('../models/battery');
var BatteryFile = require('../models/batteryFile');

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
    BatteryFile.readFromFile(callback);
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
