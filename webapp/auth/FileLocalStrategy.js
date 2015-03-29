var LocalStrategy = require('passport-local').Strategy,
    pass = require('pwd');

var users = require('../models/users');

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
                pass.hash(password, user.salt, function(err, hash) {
                    console.log("sub hash: " + hash);
                    console.log("usr hash: " + user.password);
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
            })
        });
    }
);

module.exports = fileLocalStrategy;