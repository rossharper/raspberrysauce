var express = require('express'),
    passport = require('passport');

var router = express.Router();

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login')
}

function getAuthenticationHandler() {
    return passport.authenticate('local', 
                                { 
                                    successRedirect: '/',
                                    failureRedirect: '/login' 
                                });
}

function initRoutes() {
    router.get('/login', function(req, res) {
        res.render('login', {
            title: 'Login'
        })
    });

    router.post('/login', getAuthenticationHandler());

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