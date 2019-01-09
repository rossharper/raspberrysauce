'use strict';

const BatteryFile = require('../models/batteryFile');

function getVoltageFromFile(callback) {
  BatteryFile.readFromFile(callback);
}

module.exports = {
  getCurrentVoltage: (req, res) => {
    getVoltageFromFile((voltage) => {
      res.send(voltage);
    });
  }
};
