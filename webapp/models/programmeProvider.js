'use strict';

const ProgrammeFileLoader = require('heatingprogramme').ProgrammeFileLoader;

function ProgrammeProvider(programmeDataPath) {
  this.path = programmeDataPath
}

ProgrammeProvider.prototype = {
  getProgramme: function(callback) {
    ProgrammeFileLoader.loadProgramme(this.path, (programme) => {
      callback(programme);
    });
  }
};

module.exports = ProgrammeProvider;
