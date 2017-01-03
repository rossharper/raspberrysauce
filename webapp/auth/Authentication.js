'use strict';

const passport = require('passport');
const userRepository = require('./userRepository');
const localStrategy = require('./LocalStrategy');
const bearerStrategy = require('./BearerStrategy');
const accessTokenStrategy = require('./accessTokenStrategy');

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
  passport.use('accessToken', accessTokenStrategy);
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
  getBearerHandler: function () {
    return passport.authenticate(['bearer', 'accessToken'], {
      session: false
    });
  }
};

module.exports = auth;
