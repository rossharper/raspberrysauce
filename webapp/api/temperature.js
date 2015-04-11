var Temperature = require('../models/temperature');

module.exports = {
    getCurrent: function(req, res) {
        Temperature.find().sort({date: -1}).limit(1).exec(function(err, temperature) {
            console.log(err);
            console.log(temperature);
            res.send(temperature[0]);
        });
    }
}