'use strict';

const fs = require('fs');

function TemperatureFile(sensorDataPath) {
  this.path = sensorDataPath + '/temperatureSensors/TA/value';
}

TemperatureFile.prototype = {
  readFromFile: function(callback) {
    fs.stat(this.path, (err, stats) => {
      if (err) {
        callback(err, null);
        return;
      }
      fs.readFile(this.path, 'utf8', (err, contents) => {
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
};

module.exports = TemperatureFile;
