var batteryFile = require('../../models/batteryFile'),
    temperatureFile = require('../../models/temperatureFile'),
    programmeProvider = require('../../models/programmeProvider'),
    DateUtil = require('dateutil');

function getTodaysSortedComfortPeriods(programme, date) {
    var comfortPeriods = programme.getComfortPeriodsForDate(date);
    comfortPeriods.sort(function(a, b) {
        var keyA = DateUtil.getDateFromTimeStr(date, a.startTime),
            keyB = DateUtil.getDateFromTimeStr(date, b.startTime);
        if(keyA < keyB) return -1;
        if(keyA > keyB) return 1;
        return 0;
    });
    return comfortPeriods;
}

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
                            inOverride : programme.isInOverridePeriod(now),
                            todaysComfortPeriods : getTodaysSortedComfortPeriods(programme, now)
                        }
                    };
                    res.send(view);
                });
            })
        });
    }
}
