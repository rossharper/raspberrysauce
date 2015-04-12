var Schedule = require('../models/schedule');

module.exports = {
    getSchedules: function(req, res) {
        Schedule.find().exec(function(err, schedules) {
            res.send(schedules);
        });
    },
    addSchedule: function(req, res) {
        var startTime = req.body.startTime;
        var endTime = req.body.endTime;
        var temperature = req.body.temperature;

        var startHours = startTime.substr(0,2);
        var startMins = startTime.substr(3,2);
        var endHours = endTime.substr(0,2);
        var endMins = endTime.substr(3,2);

        var newSchedule = new Schedule();
        newSchedule.startHours = startHours;
        newSchedule.startMins = startMins;
        newSchedule.endHours = endHours;
        newSchedule.endMins = endMins;
        newSchedule.targetTemperature = temperature;
        newSchedule.save(function (err) {
            if (err) return res.send("FAILED: " + err);
            res.send("OK");
        });
    }
}