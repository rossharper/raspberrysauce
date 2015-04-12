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
        Temperature.find().sort({date: 1}).exec(function(err, temperatures) {
            res.send(temperatures);
        });
    }
}