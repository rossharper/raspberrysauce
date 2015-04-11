var Temperature = function(temperatureValue, date) {
    this.temperatureValue = temperatureValue;
    this.date = date;
    this.units = "°C"
};

Temperature.prototype.getValue = function() {
    return this.temperatureValue;
}

module.exports = Temperature;