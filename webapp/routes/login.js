'use strict';

const router = require('express').Router();
const auth = require('../auth/Authentication');

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

module.exports = router;
