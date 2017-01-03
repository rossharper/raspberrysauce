'use strict';

const TemperatureFile = require('../models/temperatureFile');

const DEFAULT_TEMP_SAMPLE_INTERVAL = 120;

function getTemperatureFromFile(callback) {
  TemperatureFile.readFromFile(callback);
}

function tempMaxAge(temp) {
  const tempSampleInterval = temp.sampleInterval || DEFAULT_TEMP_SAMPLE_INTERVAL;
  const nextSampleTimestamp = new Date(temp.timestamp);
  nextSampleTimestamp.setSeconds(nextSampleTimestamp.getSeconds() + tempSampleInterval);
  return Math.max(0, Math.round((nextSampleTimestamp.getTime() - new Date().getTime()) / 1000));
}

module.exports = {
  getCurrentTemperature: function (req, res) {
    getTemperatureFromFile((err, temp) => {
      if (err) {
        res.status(500);
        res.end();
        return;
      }
      res.set('Cache-Control', `private, max-age=${tempMaxAge(temp)}`);
      res.send(temp);
    });
  }
};
