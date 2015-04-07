var LocalStrategy = require('passport-local').Strategy,
    User = require('../models/user'),
    pass = require('pwd');

function verifyPassword(password, user, done) {
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
}

module.exports = new LocalStrategy(
    function(username, password, done) {
        process.nextTick(function() {
            User.findOne({'username': username}, function (err, user) {
                if (err) {
                    return done(err);
                }
                if (!user) {
                    return done(null, false, {
                        message: 'Unknown user ' + username
                    });
                }
                verifyPassword(password, user, done);
            });
        });
    }
);
