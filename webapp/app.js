'use strict';

const express = require('express');
const morgan = require('morgan');
const stylus = require('stylus');
const nib = require('nib');
const cookieParser = require('cookie-parser');
const chalk = require('chalk');
const flash = require('connect-flash');
const expressSession = require('express-session');
const FileStore = require('session-file-store')(expressSession);
const FileHound = require('filehound');
const path = require('path');

const auth = require('./auth/Authentication');

const SESSION_COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

function setupStaticRouting(app) {
  app.use(express.static(__dirname + '/public'));
}

function setupDynamicRouting(app) {
  const routes = FileHound.create()
    .paths(path.join(__dirname, 'routes'))
    .ext('js')
    .findSync();

  routes.forEach((item) => {
    app.use('/', require(item));
  });
}

function setupViewEngine(app) {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'pug');
}

function setupLogging(app) {
  app.use(morgan('combined'));
}

function setupStylus(app) {
  app.use(stylus.middleware({
    src: __dirname + '/public',
    compile: function (str, path) {
      return stylus(str)
        .set('filename', path)
        .use(nib());
    }
  }));
}

function loadSessionSecret() {
  try {
    const config = require('./config/config');
    if (config !== null && config.sessionSecret !== null) {
      return config.sessionSecret;
    } else {
      throw 'No session secret in config';
    }
  } catch (err) {
    console.error(chalk.red(chalk.bold('ERROR') + ': No session secret found in config: using default!'));
    return 'default secret for raspberry sauce';
  }
}

function setupAuthenticationMiddleware(app) {
  app.use(cookieParser());
  let secureCookie = true;
  if(app.get('serveInsecure') === true) {
    secureCookie = false
  }
  const session = expressSession({
    cookie: {
      secure: secureCookie,
      maxAge: SESSION_COOKIE_MAX_AGE
    },
    secret: loadSessionSecret(),
    resave: false,
    rolling: true,
    saveUninitialized: false,
    store: new FileStore()
  });

  if (app.get('env') === 'test') {
    session.cookie.secure = false; // dont serve secure cookies, allows login over http
  }

  app.use(session);

  auth.initialize(app);

  app.use(flash());
}

function createApp(args) {
  const app = express();

  app.set('serveInsecure', args.serveInsecure)
  app.set('sensorDataPath', args.sensorDataPath);
  app.set('programmeDataPath', args.programmeDataPath);
  app.set('webappDataPath', args.webappDataPath);

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
