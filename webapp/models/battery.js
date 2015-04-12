var mongoose = require('mongoose');

module.exports = mongoose.model('batteryLevels',{
    device: String,
    batteryVoltage: Number,
    date: { type: Date, default: Date.now }
});