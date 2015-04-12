var mongoose = require('mongoose');

module.exports = mongoose.model('schedules',{
    startHours: { type: Number, min: 0, max: 23 },
    startMins: { type: Number, min: 0, max: 59 },
    endHours: { type: Number, min: 0, max: 23 },
    endMins: { type: Number, min: 0, max: 59 },
    targetTemperature: Number
});