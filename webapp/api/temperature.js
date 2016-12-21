var TemperatureFile = require('../models/temperatureFile');

function getTemperatureFromFile(callback) {
    TemperatureFile.readFromFile(callback);
}

module.exports = {
    getCurrentTemperature: function(req, res) {
        getTemperatureFromFile((err, temp) => {
          if(err) {
            res.status(500);
            res.end();
            return;
          }
          res.send(temp);
        } );
    }
}
