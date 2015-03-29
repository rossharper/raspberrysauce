var express = require('express'),
    morgan = require('morgan'),
    stylus = require('stylus'),
    nib = require('nib'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    chalk = require('chalk');

var auth = require('./auth/Authentication'),
    routes = require('./routes/index');

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

function loadSessionSecret() {
    try {
        var config = require('./config/config');
        if (config != null && config.sessionSecret != null) {
            return config.sessionSecret;
        }
    }
    finally {
        console.error(chalk.red(chalk.bold("ERROR") + ": No session secret found in config: using default!"));
        return "default secret for raspberry sauce";        
    }
}

function setupAuthenticationMiddleware(app) {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: false
    }));
    app.use(cookieParser());
    app.use(require('express-session')({
        secret: loadSessionSecret(),
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

module.exports = {
    create: createApp
};