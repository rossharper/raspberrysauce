'use strict';

const async = require('async');
const ProgrammeFileWriter = require('heatingprogramme').ProgrammeFileWriter;
const programmeModelBuilder = require('../models/programmeModelBuilder');
const ProgrammeProvider = require('../models/programmeProvider');
const CallingForHeatFile = require('../models/callingForHeatFile');
const Joi = require('joi');

const temperatureValueSchema = Joi.number().precision(2).required(); 
const comfortSetPointSchema = temperatureValueSchema;
const targetTemperatureOverideSchema = temperatureValueSchema;

function writeProgrammeAndReturnModes(programme, req, res) {

  const programmeDataPath = req.app.get('programmeDataPath')

  async.series({
    programme: function (callback) {
      ProgrammeFileWriter.writeProgramme(programmeDataPath, programme, (err) => {
        callback(err, programmeModelBuilder.buildFromProgramme(programme));
      });
    },
    callingForHeat: function (callback) {
      setTimeout(() => {
        new CallingForHeatFile(programmeDataPath).readFromFile((err, callingForHeat) => {
          callback(err, callingForHeat);
        });
      }, 500);
    }
  }, (err, results) => {
    if (err) {
      res.status(500);
      res.end();
      return;
    }
    res.send(results);
  });
}

function writeProgrammeThenRespondWith(req, res, programme, getResponse) {
  ProgrammeFileWriter.writeProgramme(req.app.get('programmeDataPath'), programme, (err) => {
    if (err) {
      res.status(500);
      res.end();
      return;
    }
    res.send(getResponse());
  });
}

function writeProgrammeAndReturnComfortSetpoint(req, res, programme) {
  writeProgrammeThenRespondWith(req, res, programme, () => {
    return getComfortSetPointResponseBody(programme);
  });
}

function getComfortSetPointResponseBody(programme) {
  return {
    comfortSetPoint: programme.getComfortSetPoint()
  };
}

function writeProgrammeAndReturnOverrideTemperature(req, res, programme) {
  writeProgrammeThenRespondWith(req, res, programme, () => {
    return getTargetTemperatureResponseBody(programme)
  });
}

function getTargetTemperatureResponseBody(programme) {
  return {
    targetTemperature: programme.getCurrentTargetTemperature(new Date())
  };
}

function createProgrammeProvider(req) {
  return new ProgrammeProvider(req.app.get('programmeDataPath'))
}

function comfortUntilDate(untilDate, req, res) {
  createProgrammeProvider(req).getProgramme((programme) => {
    programme.setComfortOverride(untilDate);
    writeProgrammeAndReturnModes(programme, req, res);
  });
}

function setbackUntilDate(untilDate, req, res) {
  createProgrammeProvider(req).getProgramme((programme) => {
    programme.setSetbackOverride(untilDate);
    writeProgrammeAndReturnModes(programme, req, res);
  });
}

function addDayToDate(date) {
  date.setDate(date.getDate() + 1);
  return date;
}

function setDateTimeToLocalMidnight(date) {
  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);
  date.setUTCMilliseconds(0);
  return date;
}

function setModeUntilDate(req, res, modeFunc) {
  const untilParam = req.params.until;

  const dateExpr = /^(\d{4})-?(\d{2})-?(\d{2})T(\d{2}):?(\d{2}):?(\d{2})Z$/;

  if (/^\d{13,14}$/.test(untilParam)) { // time in milliseconds UTC
    const untilInMs = parseInt(req.params.until);
    modeFunc(new Date(untilInMs), res);
  } else if (dateExpr.test(untilParam)) { // fully qualified ISO8601 UTC{
    const matchedDate = untilParam.match(dateExpr);
    const untilDate = new Date(Date.UTC(matchedDate[1], matchedDate[2], matchedDate[3], matchedDate[4], matchedDate[5], matchedDate[6]));
    modeFunc(untilDate, req, res);
  } else {
    let untilDate = addDayToDate(new Date());
    untilDate = setDateTimeToLocalMidnight(untilDate);
    modeFunc(untilDate, req, res);
  }
}

module.exports = {

  getHeatingMode: function(req, res) {
    createProgrammeProvider(req).getProgramme((programme) => {
      const now = new Date();
      const response = {
        heatingEnabled: programme.isHeatingEnabled(),
        comfortLevelEnabled: programme.isInComfortMode(now),
        inOverride: programme.isInOverridePeriod(now)
      };
      res.send(response);
    });
  },

  setHeatingModeAuto: function (req, res) {
    createProgrammeProvider(req).getProgramme((programme) => {
      programme.setHeatingOn();
      programme.clearOverride();
      writeProgrammeAndReturnModes(programme, req, res);
    });
  },

  setHeatingModeOff: function (req, res) {
    createProgrammeProvider(req).getProgramme((programme) => {
      programme.setHeatingOff();
      writeProgrammeAndReturnModes(programme, req, res);
    });
  },

  setComfortMode: function (req, res) {
    setModeUntilDate(req, res, comfortUntilDate);
  },

  setSetbackMode: function (req, res) {
    setModeUntilDate(req, res, setbackUntilDate);
  },

  getComfortSetPoint: function (req, res) {
    createProgrammeProvider(req).getProgramme((programme) => {
      res.send(getComfortSetPointResponseBody(programme));
    });
  },

  setComfortSetPoint: function (req, res) {
    createProgrammeProvider(req).getProgramme((programme) => {
      Joi.validate(req.body, comfortSetPointSchema, (err, setpoint) => {
        if (err) {
          res.status(400).send(`Set Point must be a number with maximum precision of 2 decimal places. ${req.body}`);
        } else {
          programme.setComfortSetPoint(setpoint);
          writeProgrammeAndReturnComfortSetpoint(req, res, programme);
        }
      });
    });
  },

  getTargetTemperature: function (req, res) {
    createProgrammeProvider(req).getProgramme((programme) => {
      res.send(getTargetTemperatureResponseBody(programme));
    })
  },

  setTargetTemperatureOverride: function (req, res) {
    createProgrammeProvider(req).getProgramme((programme) => {
      Joi.validate(req.body, targetTemperatureOverideSchema, (err, targetTemperatureOverride) => {
        if (err) {
          res.status(400).send(`Target Temperature Override must be a number with maximum precision of 2 decimal places. ${req.body}`);
        } else {
          programme.setOverrideTemperature(targetTemperatureOverride, new Date())
          writeProgrammeAndReturnOverrideTemperature(req, res, programme);
        }
      });
    });
  }
};
