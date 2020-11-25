'use strict';

const passport = require('passport');
const UserRepository = require('./userRepository');
const LocalStrategy = require('passport-local').Strategy;
const UserVerifier = require('./UserVerifier');
const BearerStrategyFactory = require('./BearerStrategyFactory');
const accessTokenStrategy = require('./AccessTokenStrategy');

function initPassport(webappDataPath) {

  const userRepository = new UserRepository(webappDataPath);

  passport.serializeUser((user, done) => {
    done(null, user.username);
  });

  passport.deserializeUser((id, done) => {
    process.nextTick(() => {
      userRepository.findUser(id, (err, user) => {
        done(err, user);
      });
    });
  });

  const userVerifier = new UserVerifier(userRepository);

  const localStrategy = new LocalStrategy({
    passReqToCallback: true
  },
  (req, username, password, done) => {
    process.nextTick(() => {
      userVerifier.verifyUser(username.trim(), password.trim(), (err, user) => {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false,
            req.flash('message', 'Ye shall not pass!')
          );
        }
        return done(null, user);
      });
    });
  }
  );

  passport.use('local', localStrategy);
  passport.use(new BearerStrategyFactory(webappDataPath).create());
  passport.use('accessToken', accessTokenStrategy);
}

const auth = {
  initialize: function (app) {
    initPassport(app.get('webappDataPath'));
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
