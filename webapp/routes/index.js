var express = require('express')

var auth = require('../auth/Authentication'),
    ledapi = require('../api/led'),
    boilerapi = require('../api/boiler'),
    temperatureapi = require('../api/temperature'),
    batteryapi = require('../api/battery'),
    scheduleapi = require('../api/schedule');

var router = express.Router();

function ensureAuthenticatedPage(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login')
}

function ensureAuthenticatedApiCall(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).send("401 Not Authorized");
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
        } else if (req.params[0].lastIndexOf("/api/") === 0) {
            ensureAuthenticatedApiCall(req, res, next);
        }
        else {
            ensureAuthenticatedPage(req, res, next);
        }
    });

    router.get('/', function(req, res) {
        res.render('index', {
            title: 'Home'
        })
    });

    router.get('/schedules', function(req, res) {
        res.render('schedules', {
            title: 'Schedules'
        })
    });

    router.get('/tempgraph', function(req, res) {
        res.render('tempgraph', {
            title: 'Temperature Graph'
        })
    });

    router.get('/battgraph', function(req, res) {
        res.render('battgraph', {
            title: 'Battery Graph'
        })
    });

    router.post('/api/led/on', ledapi.on);
    router.post('/api/led/off', ledapi.off);

    router.post('/api/boiler/on', boilerapi.on);
    router.post('/api/boiler/off', boilerapi.off);

    router.get('/api/temperature/currentTemperature', temperatureapi.getCurrentTemperature);
    router.get('/api/temperature/history', temperatureapi.getHistory);

    router.get('/api/battery/currentVoltage', batteryapi.getCurrentVoltage);
    router.get('/api/battery/history', batteryapi.getHistory);

    router.get('/api/schedule/all', scheduleapi.getSchedules);
    router.post('/api/schedule/add', scheduleapi.addSchedule);
}

initRoutes();

module.exports = router;