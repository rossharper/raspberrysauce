var Battery = require('../models/battery');

module.exports = {
    getCurrentVoltage: function(req, res) {
        Battery.findOne().sort({date: -1}).limit(1).exec(function(err, battery) {
            console.log(err);
            console.log(battery);
            if(battery && battery.length > 0) {
                res.send(battery[0]);
            } else {
                res.send({});
            }
        });
    }
}