'use strict';

const LocalStrategy = require('passport-local').Strategy;
const userRepository = require('./userRepository');
const pass = require('pwd');

function verifyPassword(req, password, user, done) {
    pass.hash(password, user.salt, (err, hash) => {
        if (err) {
            return done(err);
        }
        if (user.password === hash) {
            done(null, user);
        } else {
            return done(null, false,
                req.flash('message', 'Ye shall not pass!')
            );
        }
    });
}

module.exports = new LocalStrategy({
    passReqToCallback: true
    },
    (req, username, password, done) => {
        process.nextTick(() => {
            userRepository.findUser(username, (err, user) => {
              if (err) {
                  return done(err);
              }
              if (!user) {
                  return done(null, false,
                      req.flash('message', 'Ye shall not pass!')
                  );
              }
              verifyPassword(req, password, user, done);
            });
        });
    }
);
