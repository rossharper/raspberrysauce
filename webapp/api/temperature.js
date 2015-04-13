var Temperature = require('../models/temperature');

module.exports = {
    getCurrentTemperature: function(req, res) {
        Temperature.find().sort({date: -1}).limit(1).exec(function(err, temperature) {
            if(temperature && temperature.length > 0) {
                res.send(temperature[0]);
            } else {
                res.send({});
            }
        });
    },
    getHistory: function(req, res) {
        var oneDayAgo = new Date();
        oneDayAgo.setDate(oneDayAgo.getDate() - 1);
        Temperature.find().where('date').gt(oneDayAgo).sort({date: 1}).select('date temperature').exec(function(err, temperatures) {
            res.send(temperatures);
        });
    }
}