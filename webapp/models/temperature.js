var mongoose = require('mongoose');

module.exports = mongoose.model('temperatures',{
    device: String,
    temperature: Number,
    date: { type: Date, default: Date.now }
});