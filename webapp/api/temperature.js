var Temperature = require('../models/temperature');

module.exports = {
    getCurrent: function(req, res) {
        var randomTemp = (Math.random() * 30.0).toFixed(1);
        var temp = new Temperature(randomTemp, new Date());
        res.send(temp);
    }
}