'use strict';

const async = require('async');
const ProgrammeProvider = require('../../models/programmeProvider');

module.exports = {
  getView: function (req, res, next) {

    const programmeDataPath = req.app.get('programmeDataPath');
    const sensorDataPath = req.app.get('sensorDataPath')

    async.parallel({
      defaultComfortTemperature: function (callback) {
        new ProgrammeProvider(programmeDataPath).getProgramme((programme) => {
          callback(null, programme.getComfortSetPoint())
        })
      }
    }, (err, results) => {
      if (err) {
        next(err);
        return;
      }
      const view = {
        defaultComfortTemperature: results.defaultComfortTemperature
      };
      res.send(view);
    });
  }
};
