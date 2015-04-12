var Battery = require('../models/battery');

module.exports = {
    getCurrentVoltage: function(req, res) {
        Battery.find().sort({date: -1}).limit(1).exec(function(err, battery) {
            if(battery && battery.length > 0) {
                res.send(battery[0]);
            } else {
                res.send({});
            }
        });
    },
    getHistory: function(req, res) {
        Battery.find().sort({date: 1}).exec(function(err, voltages) {
            res.send(voltages);
        });
    }
}