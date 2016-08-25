'use strict';

const router = require('express').Router();
const auth = require('../auth/Authentication');

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
    if (req.params[0].lastIndexOf('/api/') === 0) {
        ensureAuthenticatedApiCall(req, res, next);
    } else {
        next();
    }
});

module.exports = router;
