const batteryFile = require('../../models/batteryFile');
const temperatureFile = require('../../models/temperatureFile');
const programmeProvider = require('../../models/programmeProvider');
const DateUtil = require('dateutil');

function getTodaysSortedComfortPeriods(programme, date) {
  const comfortPeriods = programme.getComfortPeriodsForDate(date);
  comfortPeriods.sort((a, b) => {
    const keyA = DateUtil.getDateFromTimeStr(date, a.startTime);
    const keyB = DateUtil.getDateFromTimeStr(date, b.startTime);
    if (keyA < keyB) return -1;
    if (keyA > keyB) return 1;
    return 0;
  });
  return comfortPeriods;
}

function addPeriod(periods, isComfort, startTime, endTime) {
  periods.push({
    'isComfort': isComfort,
    'startTime': startTime,
    'endTime': endTime
  });
}

function getTodaysPeriods(programme, date) {
  const comfortPeriods = getTodaysSortedComfortPeriods(programme, date);
  const finalPeriods = [];
  comfortPeriods.forEach((period) => {
    if (finalPeriods.length === 0 && DateUtil.getDateFromTimeStr(date, period.startTime) > DateUtil.getDateFromTimeStr(date, '00:00')) {
      addPeriod(finalPeriods, false, '00:00', period.startTime);
    } else if (finalPeriods.length > 0 && DateUtil.getDateFromTimeStr(date, finalPeriods[finalPeriods.length - 1].endTime) < DateUtil.getDateFromTimeStr(date, period.startTime)) {
      addPeriod(finalPeriods, false, finalPeriods[finalPeriods.length - 1].endTime, period.startTime);
    }
    addPeriod(finalPeriods, true, period.startTime, period.endTime);
  });
  if (DateUtil.getDateFromTimeStr(date, finalPeriods[finalPeriods.length - 1].endTime) < DateUtil.getDateFromTimeStr(date, '23:59')) {
    addPeriod(finalPeriods, false, finalPeriods[finalPeriods.length - 1].endTime, '23:59');
  }
  return finalPeriods;
}

module.exports = {
  getView: function (req, res, next) {
    batteryFile.readFromFile((voltage) => {
      temperatureFile.readFromFile((err, temperature) => {
        if (err) {
          next(err);
          return;
        }
        programmeProvider.getProgramme((programme) => {
          const now = new Date();
          const view = {
            temperature: temperature.temperature,
            batteryVoltage: voltage.batteryVoltage,
            programme: {
              heatingEnabled: programme.isHeatingEnabled(),
              comfortLevelEnabled: programme.isInComfortMode(now),
              inOverride: programme.isInOverridePeriod(now),
              todaysPeriods: getTodaysPeriods(programme, now)
            }
          };
          res.send(view);
        });
      });
    });
  }
};
