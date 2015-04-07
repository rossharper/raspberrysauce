var LocalStrategy = require('passport-local').Strategy,
    pass = require('pwd');

var users = require('../models/FileUsers');

function verifyPassword(password, user, done) {
    pass.hash(password, user.salt, function(err, hash) {
        if (err) {
            return done(err);
        }
        if (user.password == hash) {
            done(null, user);
        } else {
            return done(null, false, {
                message: 'Invalid password'
            });
        }
    });
}

var fileLocalStrategy = new LocalStrategy(
    function(username, password, done) {

        process.nextTick(function() {

            users.findByUsername(username, function(err, user) {
                if (err) {
                    return done(err);
                }
                if (!user) {
                    return done(null, false, {
                        message: 'Unknown user ' + username
                    });
                }
                verifyPassword(password, user, done);
            })
        });
    }
);

module.exports = fileLocalStrategy;