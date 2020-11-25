'use strict';

const fs = require('fs');

function CallingForHeatFile(programmeDataPath) {
  this.path = programmeDataPath + '/callingForHeat'
}

CallingForHeatFile.prototype = {
  readFromFile: function (callback) {
    fs.readFile(this.path, 'utf8', (err, contents) => {
      if (err) {
        callback(err, null);
        return;
      }
      let value = 0;
      try {
        value = parseInt(contents);
      } catch (e) {
        callback(e, null);
        return;
      }
      const callingForHeat = value === 1;
      callback(null, callingForHeat);
    });
  }
};

module.exports = CallingForHeatFile;
