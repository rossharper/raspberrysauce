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

function overrideUntilTimeInMillis(untilMillis, res) {
    ProgrammeFileLoader.loadProgramme(PROGRAMME_DATA_PATH, function(programme) {
        var resultingDate = new Date();
        resultingDate.setTime(untilMillis);
        res.send("OK. Comfort mode set until: " + resultingDate.toISOString());
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

        var untilParam = req.params.until;

        var dateExpr = /^(\d{4})-?(\d{2})-?(\d{2})T(\d{2}):?(\d{2}):?(\d{2})Z$/;

        if(/^\d{13,14}$/.test(untilParam)) { // time in milliseconds UTC
            var untilInMs = parseInt(req.params.until);
            overrideUntilTimeInMillis(untilInMs, res);
        }
        else if(dateExpr.test(untilParam)) // fully qualified ISO8601 UTC
        {
            var matchedDate = untilParam.match(dateExpr);
            var untilDate = new Date(Date.UTC(matchedDate[1], matchedDate[2], matchedDate[3], matchedDate[4], matchedDate[5], matchedDate[6]));
            overrideUntilTimeInMillis(untilDate.getTime(), res);
        }
        else {
            res.sendStatus(400);
        }
    }
}
