var Schedule = require('../models/schedule');

module.exports = {
    getSchedules: function(req, res) {
        Schedule.find().exec(function(err, schedules) {
            res.send(schedules);
        });
    }
}