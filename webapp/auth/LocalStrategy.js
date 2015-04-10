var LocalStrategy = require('passport-local').Strategy,
    User = require('../models/user'),
    pass = require('pwd');

function verifyPassword(req, password, user, done) {
    pass.hash(password, user.salt, function(err, hash) {
        if (err) {
            return done(err);
        }
        if (user.password == hash) {
            done(null, user);
        } else {
            return done(null, false,
                req.flash('message', 'Ye shall not pass!')
            );
        }
    });
}

module.exports = new LocalStrategy({
    passReqToCallback : true
    },
    function(req, username, password, done) {
        process.nextTick(function() {
            User.findOne({'username': username}, function (err, user) {
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
