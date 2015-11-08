var ProgrammeFileLoader = require('heatingprogramme').ProgrammeFileLoader;
var ProgrammeFileWriter = require('heatingprogramme').ProgrammeFileWriter;

// TODO: inject!
var PROGRAMME_DATA_PATH = "/var/lib/homecontrol/programdata";

module.exports = {
    setHeatingModeOff : function(req, res) {
        ProgrammeFileLoader.loadProgramme(PROGRAMME_DATA_PATH, function(programme) {
            programme.setHeatingEnabled(false);
            ProgrammeFileWriter.writeProgrammeFile(PROGRAMME_DATA_PATH, programme, function(err) {
                if(err) {
                    res.send("Write failed: " + err);
                    return;
                }
                res.send("OK");
            });
        }
    }
}
