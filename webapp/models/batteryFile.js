'use strict';

const fs = require('fs');

function readFromFile(callback) {
  fs.readFile('/var/lib/homecontrol/sensordata/temperatureSensors/TA/batt', 'utf8', (err, contents) => {
    const battery = {
      batteryVoltage: parseFloat(contents),
      device: 'TA'
    };
    callback(battery);
  });
}

module.exports = {
  readFromFile: readFromFile
};
