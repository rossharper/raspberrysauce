var batteryFile = require('../../models/batteryFile'),
    temperatureFile = require('../../models/temperatureFile'),
    ProgrammeFileLoader = require('heatingprogramme').ProgrammeFileLoader;

module.exports = {
    getView: function(req, res) {
        batteryFile.readFromFile(function(voltage) {
            temperatureFile.readFromFile(function(temperature) {

                // TODO: only loading the default programme.
                // need to specify the actual programme file location

                ProgrammeFileLoader.loadProgramme("/var/lib/homecontrol/programdata", function(programme) {
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
