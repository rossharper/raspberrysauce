var express = require('express')

var auth = require('../auth/Authentication');

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
            title: 'Login'
        })
    });

    var authenticationRedirects = {
        successRedirect: '/',
        failureRedirect: '/login'
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
}

initRoutes();

module.exports = router;