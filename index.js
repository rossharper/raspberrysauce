/*
TODO: split this shite up
*/

/*
 * Module dependencies
 */
var express = require('express'),
    morgan = require('morgan'),
    stylus = require('stylus'),
    nib = require('nib'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    pass = require('pwd');

/*
 * Submodule dependencies
 */
var users = require('./models/users'),
    routes = require('./routes/index'),
    secureServer = require('./servers/SecureServer');
    inSecureRedirect = require('./servers/RedirectingInsecureServer');

var securePort = process.argv[2] || 4443,
    insecurePort = process.argv[3] || 8080;

function stylusCompile(str, path) {
    return stylus(str)
        .set('filename', path)
        .use(nib())
}

function initPassport() {
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        users.findById(id, function(err, user) {
            done(err, user);
        });
    });

    passport.use('local', new LocalStrategy(
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
    ));
}

function setupStaticRouting(app) {
    app.use(express.static(__dirname + '/public'));
}

function setupDynamicRouting(app) {
    app.use('/', routes);
}

function createApp() {
    var app = express();
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(morgan('dev'));
    app.use(stylus.middleware({
        src: __dirname + '/public',
        compile: stylusCompile
    }));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: false
    }));
    app.use(cookieParser());
    app.use(require('express-session')({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: false
    }));
    
    initPassport();
    app.use(passport.initialize());
    app.use(passport.session());
    
    setupStaticRouting(app);
    setupDynamicRouting(app); 

    return app;
}

function start() {
    secureServer.start(createApp(), securePort);
    inSecureRedirect.start(insecurePort);
}

start();