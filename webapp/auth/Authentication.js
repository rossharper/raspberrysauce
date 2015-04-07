var passport = require('passport');

var users = require('../models/FileUsers'),
    localStrategy = require('./FileLocalStrategy');

function initPassport() {
    passport.serializeUser(users.serializeUser);

    passport.deserializeUser(users.deserializeUser);

    passport.use('local', localStrategy);
}

var auth = {
    initialize: function(app) {
        initPassport();
        app.use(passport.initialize());
        app.use(passport.session());
    }
    ,
    getAuthenticationHandler: function(authenticationRedirects) {
        return passport.authenticate(
            'local', authenticationRedirects);
    }    
}

module.exports = auth;