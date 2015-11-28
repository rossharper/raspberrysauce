var ProgrammeFileLoader = require('heatingprogramme').ProgrammeFileLoader;
var ProgrammeFileWriter = require('heatingprogramme').ProgrammeFileWriter;

// TODO: inject!
var PROGRAMME_DATA_PATH = "/var/lib/homecontrol/programdata";

function writeProgramme(programme, successMessage, res) {
    ProgrammeFileWriter.writeProgramme(PROGRAMME_DATA_PATH, programme, function(err) {
        if(err) {
            res.send("Write failed: " + err);
            return;
        }
        res.send(successMessage);
    });
}

function overrideUntilDate(untilDate, res) {
    ProgrammeFileLoader.loadProgramme(PROGRAMME_DATA_PATH, function(programme) {
        programme.setComfortOverride(untilDate);
        writeProgramme(programme, "OK. COMFORT mode set until: " + untilDate.toISOString(), res)
    });
}

module.exports = {

    setHeatingModeAuto : function(req, res) {
        ProgrammeFileLoader.loadProgramme(PROGRAMME_DATA_PATH, function(programme) {
            programme.setHeatingEnabled(true);
            programme.clearOverride();
            writeProgramme(programme, "OK. Mode set to AUTO.", res);
        })
    },

    setHeatingModeOff : function(req, res) {
        ProgrammeFileLoader.loadProgramme(PROGRAMME_DATA_PATH, function(programme) {
            programme.setHeatingEnabled(false);
            writeProgramme(programme, "OK. Mode set to OFF.", res);
        });
    },

    setComfortMode : function(req, res) {

        var untilParam = req.params.until;

        var dateExpr = /^(\d{4})-?(\d{2})-?(\d{2})T(\d{2}):?(\d{2}):?(\d{2})Z$/;

        if(/^\d{13,14}$/.test(untilParam)) { // time in milliseconds UTC
            var untilInMs = parseInt(req.params.until);
            overrideUntilDate(new Date(untilInMs), res);
        }
        else if(dateExpr.test(untilParam)) // fully qualified ISO8601 UTC
        {
            var matchedDate = untilParam.match(dateExpr);
            var untilDate = new Date(Date.UTC(matchedDate[1], matchedDate[2], matchedDate[3], matchedDate[4], matchedDate[5], matchedDate[6]));
            overrideUntilDate(untilDate, res);
        }
        else {
            res.sendStatus(400);
        }
    }
}
