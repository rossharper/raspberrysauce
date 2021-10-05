'use strict';

const async = require('async');
const BatteryFile = require('../../models/batteryFile');
const TemperatureFile = require('../../models/temperatureFile');
const CallingForHeatFile = require('../../models/callingForHeatFile');
const ProgrammeProvider = require('../../models/programmeProvider');
const programmeModelBuilder = require('../../models/programmeModelBuilder');

function doGetView(req, res, mapFunc, next) {
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

    res.send(mapFunc(results));
  });
}

function mapV1Schema(results) {
  return {
    temperature: results.temperature.temperature,
    batteryVoltage: results.batteryVoltage.batteryVoltage,
    programme: programmeModelBuilder.buildFromProgramme(results.programme),
    callingForHeat: results.callingForHeat
  };
}

function mapV2Schema(results) {
  var now = new Date()
  var heatingMode = "Off"
  let programme = results.programme
  if(programme.isHeatingEnabled()) {
    if(programme.isInOverridePeriod(now)) {
      if (programme.isInComfortMode(now)) {
        heatingMode = "Comfort"
      } else {
        heatingMode = "Setback"
      }
    } else {
      heatingMode = "Auto"
    }
  }
  return {
    heatingMode: heatingMode
  }
}

module.exports = {
  getView: function (req, res, next) {
    doGetView(req, res, mapV1Schema, next);
  },

  getViewV2: function(req, res, next) {
    doGetView(req, res, mapV2Schema, next);
  }
};
