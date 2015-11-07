var Temperature = require('../models/temperature');
var TemperatureFile = require('../models/temperatureFile');

function getLatestTemperatureFromDatabase(callback) {
    Temperature.find().sort({date: -1}).limit(1).exec(function(err, temperature) {
        if(temperature && temperature.length > 0) {
            callback(temperature[0]);
        } else {
            callback({});
        }
    });
}

function getTemperatureFromFile(callback) {
    TemperatureFile.readFromFile(callback);
}

module.exports = {
    getCurrentTemperature: function(req, res) {
        getTemperatureFromFile(function(temp) { res.send(temp); } );
    },
    getHistory: function(req, res) {
        var oneDayAgo = new Date();
        oneDayAgo.setDate(oneDayAgo.getDate() - 1);
        Temperature.find().where('date').gt(oneDayAgo).sort({date: 1}).select('-_id date temperature').exec(function(err, temperatures) {
            res.send(temperatures);
        });
    },
    addTemperatureReading: function(req, res) {
        var date = req.body.date;
        var temperature = req.body.temperature;
        var device = req.body.device;
        var dev = req.body.dev;

        console.log("date: " + date);

        var temp = new Temperature();
        temp.device = device;
        temp.temperature = temperature;
        temp.date = new Date(date);
        if(dev) {
            temp.dev = true;
        }
        temp.save(function(err) {
            if(err) {
                res.send('FAILED: ' + err);
                return
            }
            res.send("OK");
        });
    },
    removeDevTemps: function(req, res) {
        Temperature.find({dev:'dev'}).remove().exec(function(err) {
            if(err) {
                res.send('FAILED: ' + err);
                return
            }
            res.send("OK");
        });
    }
}
