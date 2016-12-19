'use strict';

const passport = require('passport');
const userRepository = require('./userRepository');
const localStrategy = require('./LocalStrategy');
const bearerStrategy = require('./BearerStrategy');

function initPassport() {
    passport.serializeUser((user, done) => {
        done(null, user.username);
    });

    passport.deserializeUser((id, done) => {
        userRepository.findUser(id, (err, user) => {
            done(err, user);
        });
    });

    passport.use('local', localStrategy);
    passport.use(bearerStrategy);
}

const auth = {
    initialize: function (app) {
        initPassport();
        app.use(passport.initialize());
        app.use(passport.session());
    },
    getAuthenticationHandler: function (authenticationRedirects) {
        return passport.authenticate('local', authenticationRedirects);
    },
    getBearerHandler: function() {
      return passport.authenticate('bearer', { session: false });
    }
};

module.exports = auth;
