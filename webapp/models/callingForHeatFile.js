'use strict';

const fs = require('fs');

const callingForHeatFilePath = '/var/lib/homecontrol/programdata/callingForHeat';

function readFromFile(callback) {
  fs.readFile(callingForHeatFilePath, 'utf8', (err, contents) => {
    if (err) {
      callback(err, null);
      return;
    }
    try {
      const value = parseInt(contents);
      const callingForHeat = value === 1;
      callback(null, callingForHeat);
    } catch (e) {
      callback(e, null);
    }
  });
}

module.exports = {
  readFromFile: readFromFile
};
