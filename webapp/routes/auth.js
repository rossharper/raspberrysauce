'use strict';

const router = require('express').Router();
const auth = require('../auth/Authentication');

function ensureAuthenticatedPage(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

function ensureAuthenticatedApiCall(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).send('401 Not Authorized');
}

router.get('/login', (req, res) => {
    res.render('login', {
        title: 'Login',
        message: req.flash('message')
    });
});

const authenticationRedirects = {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
};
router.post('/login', auth.getAuthenticationHandler(authenticationRedirects));

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/login');
});

router.all('*', (req, res, next) => {
    if (req.params === '/login') {
        next();
    } else if (req.params[0].lastIndexOf('/api/') === 0) {
        ensureAuthenticatedApiCall(req, res, next);
    } else {
        ensureAuthenticatedPage(req, res, next);
    }
});

module.exports = router;
