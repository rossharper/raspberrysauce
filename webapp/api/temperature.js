var TemperatureFile = require('../models/temperatureFile');

function getTemperatureFromFile(callback) {
    TemperatureFile.readFromFile(callback);
}

module.exports = {
    getCurrentTemperature: function(req, res) {
        getTemperatureFromFile(function(temp) { res.send(temp); } );
    }
}
