var BatteryFile = require('../models/batteryFile');

function getVoltageFromFile(callback) {
    BatteryFile.readFromFile(callback);
}

module.exports = {
    getCurrentVoltage: function(req, res) {
        getVoltageFromFile(function(voltage) { res.send(voltage) });
    }
}
