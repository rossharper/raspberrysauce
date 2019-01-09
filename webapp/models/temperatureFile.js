'use strict';

const fs = require('fs');

const temperatureSensorFilePath = '/var/lib/homecontrol/sensordata/temperatureSensors/TA/value';

function readFromFile(callback) {
  fs.stat(temperatureSensorFilePath, (err, stats) => {
    if (err) {
      callback(err, null);
      return;
    }
    fs.readFile(temperatureSensorFilePath, 'utf8', (err, contents) => {
      if (err) {
        callback(err, null);
        return;
      }
      const temperature = {
        temperature: parseFloat(contents),
        device: 'TA',
        timestamp: stats.mtime
      };
      callback(null, temperature);
    });
  });
}

module.exports = {
  readFromFile: readFromFile
};
