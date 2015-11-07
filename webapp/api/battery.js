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

module.exports = {
    getCurrentVoltage: function(req, res) {
        getLatestVoltageFromDatabase(function(voltage) { res.send(voltage) });
    },
    getHistory: function(req, res) {
        Battery.find().sort({date: 1}).exec(function(err, voltages) {
            res.send(voltages);
        });
    }
}
