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
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser');

/*
 * Submodule dependencies
 */
var auth = require('./auth/Authentication');
    routes = require('./routes/index'),
    secureServer = require('./servers/SecureServer');
    inSecureRedirect = require('./servers/RedirectingInsecureServer');

var securePort = process.argv[2] || 4443,
    insecurePort = process.argv[3] || 8080;

function setupStaticRouting(app) {
    app.use(express.static(__dirname + '/public'));
}

function setupDynamicRouting(app) {
    app.use('/', routes);
}

function setupViewEngine(app) {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
}

function setupLogging(app) {
    app.use(morgan('dev'));
}

function setupStylus(app) {
    app.use(stylus.middleware({
        src: __dirname + '/public',
        compile: function(str, path) {
            return stylus(str)
                .set('filename', path)
                .use(nib())
        }
    }));
}

function setupAuthenticationMiddleware(app) {
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
    
    auth.initialize(app);
}

function createApp() {
    var app = express();
    
    setupViewEngine(app);
    setupLogging(app);
    setupStylus(app);
    setupAuthenticationMiddleware(app);
    setupStaticRouting(app);
    setupDynamicRouting(app); 

    return app;
}

function start() {
    secureServer.start(createApp(), securePort);
    inSecureRedirect.start(insecurePort);
}

start();