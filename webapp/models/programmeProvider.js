'use strict';

const ProgrammeFileLoader = require('heatingprogramme').ProgrammeFileLoader;

module.exports = {
  getProgramme: (callback) => {
    ProgrammeFileLoader.loadProgramme('/var/lib/homecontrol/programdata', (programme) => {
      callback(programme);
    });
  }
};
