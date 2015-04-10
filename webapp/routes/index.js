var express = require('express')

var auth = require('../auth/Authentication'),
    ledapi = require('../api/led'),
    boilerapi = require('../api/boiler');

var router = express.Router();

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login')
}

function initRoutes() {
    router.get('/login', function(req, res) {
        res.render('login', {
            title: 'Login',
            message: req.flash('message')
        })
    });

    var authenticationRedirects = {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    };
    router.post('/login', auth.getAuthenticationHandler(authenticationRedirects));

    router.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/login');
    });

    router.all('*', function(req, res, next) {
        if (req.params === '/login') {
            next();
        }
        else {
            ensureAuthenticated(req, res, next);
        }
    });

    router.get('/', function(req, res) {
        res.render('index', {
            title: 'Home'
        })
    });

    router.post('/api/led/on', ledapi.on);
    router.post('/api/led/off', ledapi.off);

    router.post('/api/boiler/on', boilerapi.on);
    router.post('/api/boiler/off', boilerapi.off);
}

initRoutes();

module.exports = router;