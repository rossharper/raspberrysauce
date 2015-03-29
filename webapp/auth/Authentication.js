var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    pass = require('pwd');

var users = require('../models/users');

function createLocalStrategy() {
    return new LocalStrategy(
        function(username, password, done) {
            // asynchronous verification, for effect...
            process.nextTick(function() {

                // Find the user by username.  If there is no user with the given
                // username, or the password is not correct, set the user to `false` to
                // indicate failure and set a flash message.  Otherwise, return the
                // authenticated `user`.
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
                        if(err) { 
                            return done(err); 
                        }
                        if (user.password == hash) {
                            done(null, user);
                        }
                        else {
                            return done(null, false, {
                                message: 'Invalid password'
                            });
                        }
                    });
                })
            });
        }
    )
}

function initPassport() {
    passport.serializeUser(users.serializeUser);

    passport.deserializeUser(users.deserializeUser);

    passport.use('local', createLocalStrategy());
}

var auth = {
    initialize: function(app) {
        initPassport();
        app.use(passport.initialize());
        app.use(passport.session());
    }
    ,
    getAuthenticationHandler: function(authenticationRedirects) {
        return passport.authenticate(
            'local', authenticationRedirects);
    }    
}

module.exports = auth;