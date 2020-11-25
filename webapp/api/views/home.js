'use strict';

const async = require('async');
const BatteryFile = require('../../models/batteryFile');
const TemperatureFile = require('../../models/temperatureFile');
const CallingForHeatFile = require('../../models/callingForHeatFile');
const ProgrammeProvider = require('../../models/programmeProvider');
const programmeModelBuilder = require('../../models/programmeModelBuilder');

module.exports = {
  getView: function (req, res, next) {

    const programmeDataPath = req.app.get('programmeDataPath');
    const sensorDataPath = req.app.get('sensorDataPath')

    async.parallel({
      callingForHeat: function (callback) {
        new CallingForHeatFile(programmeDataPath).readFromFile((err, callingForHeat) => {
          callback(err, callingForHeat);
        });
      },
      batteryVoltage: function (callback) {
        new BatteryFile(sensorDataPath).readFromFile((voltage) => {
          callback(null, voltage);
        });
      },
      temperature: function (callback) {
        new TemperatureFile(sensorDataPath).readFromFile((err, temperature) => {
          callback(err, temperature);
        });
      },
      programme: function (callback) {
        new ProgrammeProvider(programmeDataPath).getProgramme((programme) => {
          callback(null, programme);
        });
      }
    }, (err, results) => {
      if (err) {
        next(err);
        return;
      }
      const view = {
        temperature: results.temperature.temperature,
        batteryVoltage: results.batteryVoltage.batteryVoltage,
        programme: programmeModelBuilder.buildFromProgramme(results.programme),
        callingForHeat: results.callingForHeat
      };
      res.send(view);
    });
  }
};
