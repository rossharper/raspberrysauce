'use strict';

const async = require('async');
const batteryFile = require('../../models/batteryFile');
const temperatureFile = require('../../models/temperatureFile');
const callingForHeatFile = require('../../models/callingForHeatFile');
const programmeProvider = require('../../models/programmeProvider');
const programmeModelBuilder = require('../../models/programmeModelBuilder');

module.exports = {
  getView: function (req, res, next) {

    async.parallel({
      callingForHeat: function (callback) {
        callingForHeatFile.readFromFile((err, callingForHeat) => {
          callback(err, callingForHeat);
        });
      },
      batteryVoltage: function (callback) {
        batteryFile.readFromFile((voltage) => {
          callback(null, voltage);
        });
      },
      temperature: function (callback) {
        temperatureFile.readFromFile((err, temperature) => {
          callback(err, temperature);
        });
      },
      programme: function (callback) {
        programmeProvider.getProgramme((programme) => {
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
