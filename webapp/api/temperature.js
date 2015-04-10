module.exports = {
    getCurrent: function(req, res) {
        var randomTemp = (Math.random() * (21.0 - 4.0) + 4.0).toFixed(1);
        res.send(randomTemp);
    }
}