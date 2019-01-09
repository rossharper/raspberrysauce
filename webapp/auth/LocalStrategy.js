'use strict';

const LocalStrategy = require('passport-local').Strategy;
const verifyUser = require('./verifyUser');

module.exports = new LocalStrategy({
  passReqToCallback: true
},
(req, username, password, done) => {
  process.nextTick(() => {
    verifyUser(username, password, (err, user) => {
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
