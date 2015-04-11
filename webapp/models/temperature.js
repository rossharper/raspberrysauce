var Temperature = function(temperatureValue, date) {
    this.temperatureValue = temperatureValue;
    this.date = date;
};

Temperature.prototype.getValue = function() {
    return this.temperatureValue;
}

module.exports = Temperature;