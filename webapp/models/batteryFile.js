'use strict';

const fs = require('fs');

function BatteryFile(sensorDataPath) {
  this.sensorPath = sensorDataPath + '/temperatureSensors/TA/batt';
}

BatteryFile.prototype = {
  readFromFile: function(callback) {
    fs.readFile(this.sensorPath, 'utf8', (err, contents) => {
      const battery = {
        batteryVoltage: parseFloat(contents),
        device: 'TA'
      };
      callback(battery);
    });
  }
};

module.exports = BatteryFile;
