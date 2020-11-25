'use strict';

const BatteryFile = require('../models/batteryFile');

function getVoltageFromFile(batteryFile, callback) {
  batteryFile.readFromFile(callback);
}

module.exports = {
  getCurrentVoltage: (req, res) => {
    getVoltageFromFile(new BatteryFile(req.app.get('sensorDataPath')), (voltage) => {
      res.send(voltage);
    });
  }
};
