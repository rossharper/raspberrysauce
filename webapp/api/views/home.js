var batteryFile = require('../../models/batteryFile'),
    temperatureFile = require('../../models/temperatureFile');

module.exports = {
    getView: function(req, res) {
        batteryFile.readFromFile(function(voltage) {
            temperatureFile.readFromFile(function(temperature) {
                var view = {
                    temperature : temperature,
                    batteryVoltage : voltage
                };
                res.send(view);
            })
        });
    }
}
