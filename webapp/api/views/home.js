var batteryFile = require('../../models/batteryFile'),
    temperatureFile = require('../../models/temperatureFile'),
    programmeProvider = require('../../models/programmeProvider');

module.exports = {
    getView: function(req, res) {
        batteryFile.readFromFile(function(voltage) {
            temperatureFile.readFromFile(function(temperature) {
                programmeProvider.getProgramme(function(programme) {
                    var now = new Date();
                    var view = {
                        temperature : temperature.temperature,
                        batteryVoltage : voltage.batteryVoltage,
                        programme : {
                            heatingEnabled : programme.isHeatingEnabled(),
                            comfortLevelEnabled : programme.isInComfortMode(now),
                            inOverride : programme.isInOverridePeriod(now)
                        }
                    };
                    res.send(view);
                });
            })
        });
    }
}
