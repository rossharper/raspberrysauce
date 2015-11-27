var ProgrammeFileLoader = require('heatingprogramme').ProgrammeFileLoader;
var ProgrammeFileWriter = require('heatingprogramme').ProgrammeFileWriter;

// TODO: inject!
var PROGRAMME_DATA_PATH = "/var/lib/homecontrol/programdata";

function writeProgramme(programme, res) {
    ProgrammeFileWriter.writeProgramme(PROGRAMME_DATA_PATH, programme, function(err) {
        if(err) {
            res.send("Write failed: " + err);
            return;
        }
        res.send("OK");
    });
}

module.exports = {

    setHeatingModeAuto : function(req, res) {
        ProgrammeFileLoader.loadProgramme(PROGRAMME_DATA_PATH, function(programme) {
            programme.setHeatingEnabled(true);
            programme.clearOverride();
            writeProgramme(programme, res);
        })
    },

    setHeatingModeOff : function(req, res) {
        ProgrammeFileLoader.loadProgramme(PROGRAMME_DATA_PATH, function(programme) {
            programme.setHeatingEnabled(false);
            writeProgramme(programme, res);
        });
    },

    setComfortMode : function(req, res) {

        // TODO:should it be ms on API or ISO8601?
        var untilInMs = parseInt(req.params.until);

        ProgrammeFileLoader.loadPrograme(PROGRAMME_DATA_PATH, function(programme) {
            // TODO: set override on programme
        });
    }
}
