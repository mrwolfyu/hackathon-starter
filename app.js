/**
 * Module dependencies.
 */
const express = require('express');
const compression = require('compression');
const session = require('express-session');
const bodyParser = require('body-parser');
const logger = require('morgan');
const errorHandler = require('errorhandler');
const lusca = require('lusca');
const dotenv = require('dotenv');
const MongoStore = require('connect-mongo')(session);
const flash = require('express-flash');
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const expressValidator = require('express-validator');
const sass = require('node-sass-middleware');
const multer = require('multer');
const upload = multer({ dest: path.join(__dirname, 'uploads') });
const config = require('./.config.json')
/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.load({ path: '.env' });

/**
 * Controllers (route handlers).
 */
const homeController = require('./controllers/home');
const listenerController = require('./controllers/listener');
const userController = require('./controllers/user');
const roomController = require('./controllers/room');
const bbbController = require('./controllers/bbb');

/**
 * API keys and Passport configuration.
 */
const passportConfig = require('./config/passport');

/**
 * Create Express server.
 */
const app = express();

/**
 * Connect to MongoDB.
 */
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || process.env.MONGOLAB_URI);
mongoose.connection.on('error', () => {
  console.error('MongoDB Connection Error. Please make sure that MongoDB is running.');
  process.exit(1);
});

/**
 * Express configuration.
 */

app.set('port', process.env.PORT || 3000);
app.set('host', process.env.HOST || 'localhost');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(compression());
app.use(sass({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public')
}));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET,
  store: new MongoStore({
    url: process.env.MONGODB_URI || process.env.MONGOLAB_URI,
    autoReconnect: true
  })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req, res, next) => {
  if (req.path === '/api/upload') {
    next();
  } else {
    lusca.csrf()(req, res, next);
  }
});
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});
app.use(function(req, res, next) {
  // After successful login, redirect back to the intended page
  if (!req.user &&
      req.path !== '/login' &&
      req.path !== '/signup' &&
      !req.path.match(/^\/auth/) &&
      !req.path.match(/\./)) {
    req.session.returnTo = req.path;
  }
  next();
});
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));
/**
 * Primary app routes.
 */
app.get('/', passportConfig.isAuthenticated, homeController.index);
app.get('/admin', passportConfig.isAdmin,  homeController.adminindex);
app.get('/listener', passportConfig.isAdmin,  listenerController.getRecordings);
app.get('/admin/create/:id', passportConfig.isAdmin,  homeController.create);
app.get('/admin/join/:id', passportConfig.isAdmin,  homeController.join);
app.get('/admin/joinbymid/:id',   homeController.joinbymid);
app.get('/login', userController.getLogin);
app.post('/login', userController.postLogin);
app.get('/logout', userController.logout);
app.get('/roomc',  passportConfig.isAdmin, roomController.getRoom);
app.get('/bbb',  passportConfig.isAdmin, bbbController.index);
app.get('/recording',  passportConfig.isAdmin, bbbController.getRecordings);
app.get('/recording/:id',  passportConfig.isAdmin, bbbController.getRecordingsById);
app.get('/recording/:id/:action',  passportConfig.isAdmin, bbbController.actRecordingsById);
app.get('/play/:id/:orig',  passportConfig.isAdmin, bbbController.playRecordingsById);
app.get('/meeting/:id',  passportConfig.isAdmin, bbbController.getMeetingsById);
app.get('/meetingdelete/:id',  passportConfig.isAdmin, bbbController.deleteMeetingsById);
app.get('/meeting',  passportConfig.isAdmin, bbbController.getMeetings);
app.get('/signup',  passportConfig.isAdmin, userController.getSignup);
app.post('/roomc',  passportConfig.isAdmin, roomController.postRoom);
app.post('/signup',  passportConfig.isAdmin, userController.postSignup);
app.get('/account/:id', passportConfig.isAdmin, userController.getAccountById);
app.get('/help/profile', passportConfig.isAdmin, userController.getHelpProfile);
app.get('/roomc/:id', passportConfig.isAdmin, roomController.getRoomById);
app.post('/account/profile/:id', passportConfig.isAdmin, userController.postUpdateProfileById);
app.post('/roomc/:id', passportConfig.isAdmin, roomController.postRoomById);
app.get('/roomc/delete/:id', passportConfig.isAdmin, roomController.postDeleteRoomById);
app.post('/account/password', passportConfig.isAuthenticated, userController.postUpdatePassword);
app.post('/account/password/:id', passportConfig.isAdmin, userController.postUpdatePasswordById);
app.post('/account/delete', passportConfig.isAdmin, userController.postDeleteAccount);
app.post('/account/delete/:id', passportConfig.isAdmin, userController.postDeleteAccountById);

/**
 * Error Handler.
 */
app.use(errorHandler());



app.use('/default.pdf', express.static(__dirname + '/default.pdf'));

/**
 * Start Express server.
 */
app.listen(app.get('port'), app.get('host'), () => {
  console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
});

module.exports = app;
