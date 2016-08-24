'use strict';

const passport = require('passport');
const userRepository = require('./userRepository');
const localStrategy = require('./LocalStrategy');

function initPassport() {
    passport.serializeUser((user, done) => {
        done(null, user.username);
    });

    passport.deserializeUser((username, done) => {
        userRepository.findUser(username, (err, user) => {
            done(err, user);
        });
    });

    passport.use('local', localStrategy);
}

const auth = {
    initialize: function (app) {
        initPassport();
        app.use(passport.initialize());
        app.use(passport.session());
    },
    getAuthenticationHandler: function (authenticationRedirects) {
        return passport.authenticate(
            'local', authenticationRedirects);
    }
};

module.exports = auth;
