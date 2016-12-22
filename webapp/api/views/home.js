const batteryFile = require('../../models/batteryFile');
const temperatureFile = require('../../models/temperatureFile');
const programmeProvider = require('../../models/programmeProvider');
const programmeModelBuilder = require('../../models/programmeModelBuilder');

module.exports = {
  getView: function (req, res, next) {
    batteryFile.readFromFile((voltage) => {
      temperatureFile.readFromFile((err, temperature) => {
        if (err) {
          next(err);
          return;
        }
        programmeProvider.getProgramme((programme) => {
          const view = {
            temperature: temperature.temperature,
            batteryVoltage: voltage.batteryVoltage,
            programme: programmeModelBuilder.buildFromProgramme(programme)
          };
          res.send(view);
        });
      });
    });
  }
};
