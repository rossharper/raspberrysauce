var express = require('express')

var


    homeviewapi = require('../api/views/home');

var router = express.Router();

function initRoutes() {





    router.get('/api/views/home', homeviewapi.getView);
}

initRoutes();

module.exports = router;
