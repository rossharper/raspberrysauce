'use strict';

const router = require('express').Router();
const auth = require('../auth/Authentication');
const bodyParser = require('body-parser');

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
router.post('/login', bodyParser.urlencoded({ extended: false }), auth.getAuthenticationHandler(authenticationRedirects));

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/login');
});

module.exports = router;
