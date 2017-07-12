const _ = require('lodash');
const passport = require('passport');
const request = require('request');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/User');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

/**
 * Sign in using Email and Password.
 */
passport.use(new LocalStrategy({ usernameField: 'username' }, (username, password, done) => {
  
      User.findOne({ username: username }, (err, user) => {
    if (!user) {
      return done(null, false, { msg: `Username ${username} not found.` });
    }
    user.comparePassword(password, (err, isMatch) => {
      if (isMatch) {
        return done(null, user);
      }
      return done(null, false, { msg: 'Invalid username or password.' });
    });
  });
}));
/**
 * Login Required middleware.
 */
exports.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
};

/**
 * Authorization Required middleware.
 */
exports.isAuthorized = (req, res, next) => {
  const provider = req.path.split('/').slice(-1)[0];
  if (_.find(req.user.tokens, { kind: provider })) {
    next();
  } else {
    res.redirect(`/auth/${provider}`);
  }
};


exports.isAdmin = (req, res, next) => {
  if ( req.isAuthenticated()  && req.user.profile.tip === 'admin' ) {
    next();
  } else {
    res.redirect(`/logout`);
  }
};

exports.isListener = (req, res, next) => {
  if ( req.isAuthenticated()  && req.user.profile.tip === 'listener' ) {
    next();
  } else {
    res.redirect(`/logout`);
  }
};









