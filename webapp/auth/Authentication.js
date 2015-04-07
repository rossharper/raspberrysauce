var passport = require('passport');

var User = require('../models/user'),
    localStrategy = require('./LocalStrategy');

function initPassport() {
    passport.serializeUser(function(user, done) {
        done(null, user._id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

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