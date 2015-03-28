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
    https = require('https'),
    http = require('http'),
    sslrootcas = require('ssl-root-cas'),
    fs = require('fs'),
    path = require('path'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    users = require('./models/users');

var port = process.argv[2] || 4443,
    insecurePort = process.argv[3] || 8080;

/* temporary shitty user model */
/*
var users = [
    { id: 1, username: 'bob', password: 'secret', email: 'bob@example.com' }
];

function findById(id, fn) {
    var idx = id - 1;
    if (users[idx]) {
        fn(null, users[idx]);
    } else {
        fn(new Error('User ' + id + ' does not exist'));
    }
}

function findByUsername(username, fn) {
    for (var i = 0, len = users.length; i < len; i++) {
        var user = users[i];
        if (user.username === username) {
            return fn(null, user);
        }
    }
    return fn(null, null);
}
*/

// Config file - don't store in repo
var config = require('./config');

function configureRootCerts() {
    sslrootcas
        .inject()
        .addFile(path.join(__dirname, config.sslcerts.cacertpath, config.sslcerts.cacert));
}

function getSslServerOptions() {
    var options = {
        key: fs.readFileSync(path.join(__dirname, config.sslcerts.servercertpath, config.sslcerts.serverkey)),
        cert: fs.readFileSync(path.join(__dirname, config.sslcerts.servercertpath, config.sslcerts.servercert)),
        passphrase: config.sslcerts.passphrase
    };
    return options;
}

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
                    if (user.password != password) {
                        return done(null, false, {
                            message: 'Invalid password'
                        });
                    }
                    return done(null, user);
                })
            });
        }
    ));
}

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login')
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
    
    app.use(express.static(__dirname + '/public'));

    app.get('/login', function(req, res) {
        res.render('login', {
            title: 'Login'
        })
    });

    app.post('/login', function(req, res, next) {
        passport.authenticate('local', function(err, user, info) {
            if (err) {
                return next(err)
            }
            if (!user) {
                return res.redirect('/login')
            }
            req.logIn(user, function(err) {
                if (err) {
                    return next(err);
                }
                return res.redirect('/');
            });
        })(req, res, next);
    });

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/login');
    });

    app.all('*', function(req, res, next) {
        if (req.params === '/login') {
            next();
        }
        else {
            ensureAuthenticated(req, res, next);
        }
    });

    app.get('/', function(req, res) {
        res.render('index', {
            title: 'Home'
        })
    });

    return app;
}

function configureSslServer() {
    configureRootCerts();
    var options = getSslServerOptions();
    
    var server = https.createServer(options, createApp()).listen(port, function() {
        port = server.address().port;
        console.log('Listening on https://' + server.address().address + ':' + port);
    });
}

function configureInsecureTrafficRedirect() {
    var insecureServer = http.createServer();
    insecureServer.on('request', function(req, res) {
        // TODO also redirect websocket upgrades
        res.setHeader(
            'Location', 'https://' + req.headers.host.replace(/:\d+/, '') + req.url
        );
        res.statusCode = 302;
        res.end();
    });
    insecureServer.listen(insecurePort, function() {
        console.log("\nRedirecting all http traffic to https\n");
    });
}

function start() {
    configureSslServer();
    configureInsecureTrafficRedirect();
}

start();