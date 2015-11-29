var ProgrammeFileLoader = require('heatingprogramme').ProgrammeFileLoader;

module.exports = {
        getProgramme : function(callback) {
            ProgrammeFileLoader.loadProgramme("/var/lib/homecontrol/programdata", function(programme) {
                callback(programme);
            });
        }
};
