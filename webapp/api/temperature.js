var Temperature = require('../models/temperature');

module.exports = {
    getCurrent: function(req, res) {
        var randomTemp = (Math.random() * (21.0 - 4.0) + 4.0).toFixed(1);
        var temp = new Temperature(randomTemp, new Date());
        res.send(temp);
    }
}