var ProgrammeFileLoader = require('heatingprogramme').ProgrammeFileLoader;
var ProgrammeFileWriter = require('heatingprogramme').ProgrammeFileWriter;
var programmeModelBuilder = require('../models/programmeModelBuilder')
var programmeProvider = require('../models/programmeProvider');

// TODO: inject!
var PROGRAMME_DATA_PATH = "/var/lib/homecontrol/programdata";

function writeProgramme(programme, res) {
  ProgrammeFileWriter.writeProgramme(PROGRAMME_DATA_PATH, programme, function (err) {
    if (err) {
      res.status(500);
      res.end();
      return;
    }
    res.send(programmeModelBuilder.buildFromProgramme(programme));
  });
}

function comfortUntilDate(untilDate, res) {
  programmeProvider.getProgramme(function (programme) {
    programme.setComfortOverride(untilDate);
    writeProgramme(programme, res)
  });
}

function setbackUntilDate(untilDate, res) {
  programmeProvider.getProgramme(function (programme) {
    programme.setSetbackOverride(untilDate);
    writeProgramme(programme, res)
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
  var untilParam = req.params.until;

  var dateExpr = /^(\d{4})-?(\d{2})-?(\d{2})T(\d{2}):?(\d{2}):?(\d{2})Z$/;

  if (/^\d{13,14}$/.test(untilParam)) { // time in milliseconds UTC
    var untilInMs = parseInt(req.params.until);
    modeFunc(new Date(untilInMs), res);
  } else if (dateExpr.test(untilParam)) // fully qualified ISO8601 UTC
  {
    var matchedDate = untilParam.match(dateExpr);
    var untilDate = new Date(Date.UTC(matchedDate[1], matchedDate[2], matchedDate[3], matchedDate[4], matchedDate[5], matchedDate[6]));
    modeFunc(untilDate, res);
  } else {
    var untilDate = addDayToDate(new Date());
    untilDate = setDateTimeToLocalMidnight(untilDate);
    modeFunc(untilDate, res);
  }
}

module.exports = {

  setHeatingModeAuto: function (req, res) {
    programmeProvider.getProgramme(function (programme) {
      programme.setHeatingOn();
      programme.clearOverride();
      writeProgramme(programme, res);
    })
  },

  setHeatingModeOff: function (req, res) {
    programmeProvider.getProgramme(function (programme) {
      programme.setHeatingOff();
      writeProgramme(programme, res);
    });
  },

  setComfortMode: function (req, res) {
    setModeUntilDate(req, res, comfortUntilDate);
  },

  setSetbackMode: function (req, res) {
    setModeUntilDate(req, res, setbackUntilDate);
  }
}
