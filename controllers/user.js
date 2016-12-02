const async = require('async');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const passport = require('passport');
const User = require('../models/User');
const Room = require('../models/Room');
const config = require('../.config.json');
/**
 * GET /login
 * Login page.
 */


exports.getLogin = (req, res) => {
  if (req.user) {
    req.logout();
    return res.redirect('/');
  }
  else {
  	res.render('account/login', {
    		title: 'Login'
  	});
 }
};

exports.getHelpProfile = (req, res) => {

var xml = '';

xml ='<config>\
<localeversion suppressWarning="false">0.9.0</localeversion>\
<version>419</version>\
<help url="http://'+config.BBB_IP+'/help.html"/>\
<javaTest url="http://'+config.BBB_IP+'/testjava.html"/>\
<porttest host="'+config.BBB_IP+'" application="video/portTest" timeout="10000"/>\
<bwMon server="'+config.BBB_IP+'" application="video/bwTest"/>\
<application uri="rtmp://'+config.BBB_IP+'/bigbluebutton" host="http://'+config.BBB_IP+'/bigbluebutton/api/enter"/>\
<language userSelectionEnabled="true"/>\
<skinning enabled="true" url="http://'+config.BBB_IP+'/client/branding/css/BBBDefault.css.swf"/>\
<shortcutKeys showButton="true"/>\
<browserVersions chrome="47" firefox="43" flash="19" java="1.7.0_51"/>\
<layout showLogButton="false" defaultLayout="S2SPresentation" showToolbar="true" showFooter="true" showMeetingName="true" showHelpButton="true" showLogoutWindow="true" showLayoutTools="true" confirmLogout="true" showRecordingNotification="true"/>\
<meeting muteOnStart="false"/>\
<logging enabled="true" target="trace" level="info" format="{dateUTC} {time} :: {name} :: [{logLevel}] {message}" uri="http://'+config.BBB_IP+'"/>\
<lock disableCamForLockedUsers="false" disableMicForLockedUsers="false" disablePrivateChatForLockedUsers="false" disablePublicChatForLockedUsers="false" lockLayoutForLockedUsers="false" lockOnJoin="true" lockOnJoinConfigurable="false"/>\
<modules>\
<module name="ChatModule" url="http://'+config.BBB_IP+'/client/ChatModule.swf?v=419" uri="rtmp://'+config.BBB_IP+'/bigbluebutton" dependsOn="UsersModule" privateEnabled="true" fontSize="12" position="top-right" baseTabIndex="701" colorPickerIsVisible="false" maxMessageLength="1024"/>\
<module name="UsersModule" url="http://'+config.BBB_IP+'/client/UsersModule.swf?v=419" uri="rtmp://'+config.BBB_IP+'/bigbluebutton" allowKickUser="true" enableEmojiStatus="true" enableSettingsButton="true" baseTabIndex="301"/>\
<module name="DeskShareModule" url="http://'+config.BBB_IP+'/client/DeskShareModule.swf?v=419" uri="rtmp://'+config.BBB_IP+'/deskShare" publishURI="'+config.BBB_IP+'" useTLS="false" showButton="true" autoStart="false" autoFullScreen="false" baseTabIndex="201"/>\
<module name="PhoneModule" url="http://'+config.BBB_IP+'/client/PhoneModule.swf?v=419" uri="rtmp://'+config.BBB_IP+'/sip" autoJoin="true" listenOnlyMode="true" presenterShareOnly="false" skipCheck="false" showButton="true" enabledEchoCancel="true" useWebRTCIfAvailable="true" showPhoneOption="false" echoTestApp="9196" dependsOn="UsersModule"/>\
<module name="VideoconfModule" url="http://'+config.BBB_IP+'/client/VideoconfModule.swf?v=419" uri="rtmp://'+config.BBB_IP+'/video" dependson="UsersModule" baseTabIndex="401" presenterShareOnly="false" controlsForPresenter="false" autoStart="false" skipCamSettingsCheck="false" showButton="true" showCloseButton="true" publishWindowVisible="true" viewerWindowMaxed="false" viewerWindowLocation="top" smoothVideo="false" applyConvolutionFilter="false" convolutionFilter="-1, 0, -1, 0, 6, 0, -1, 0, -1" filterBias="0" filterDivisor="4" displayAvatar="false" focusTalking="false" glowColor="0x4A931D" glowBlurSize="30.0" priorityRatio="0.67"/>\
<module name="WhiteboardModule" url="http://'+config.BBB_IP+'/client/WhiteboardModule.swf?v=419" uri="rtmp://'+config.BBB_IP+'/bigbluebutton" dependsOn="PresentModule" baseTabIndex="601" whiteboardAccess="presenter" keepToolbarVisible="false"/>\
<module name="PollingModule" url="http://'+config.BBB_IP+'/client/PollingModule.swf?v=419" uri="rtmp://'+config.BBB_IP+'/bigbluebutton" dependsOn="PresentModule"/>\
<module name="PresentModule" url="http://'+config.BBB_IP+'/client/PresentModule.swf?v=419" uri="rtmp://'+config.BBB_IP+'/bigbluebutton" host="http://'+config.BBB_IP+'" showPresentWindow="true" showWindowControls="true" openExternalFileUploadDialog="false" dependsOn="UsersModule" baseTabIndex="501" maxFileSize="30"/>\
<module name="LayoutModule" url="http://'+config.BBB_IP+'/client/LayoutModule.swf?v=419" uri="rtmp://'+config.BBB_IP+'/bigbluebutton" layoutConfig="http://'+config.BBB_IP+'/client/conf/layout.xml" enableEdit="false"/>\
</modules>\
</config>';


     return res.render('help', {
                title: 'Help',
                admin: 'admin',
                xml: xml,
                LOCATION: config.LOCATION
        });
};


/**
 * POST /login
 * Sign in using email and password.
 */
exports.postLogin = (req, res, next) => {
  req.assert('username', 'Username is not valid').notEmpty();
  req.assert('password', 'Password cannot be blank').notEmpty();

  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/login');
  }

  passport.authenticate('local', (err, user, info) => {
    if (err) { return next(err); }
    if (!user) {
      req.flash('errors', info);
      return res.redirect('/login');
    }
    req.logIn(user, (err) => {
      if (err) { return next(err); }
      req.flash('success', { msg: 'Success! You are logged in.' });
      res.redirect(req.session.returnTo || '/');
    });
  })(req, res, next);

};

/**
 * GET /logout
 * Log out.
 */
exports.logout = (req, res) => {
  req.logout();
  res.redirect('/');
};

/**
 * GET /signup
 * Signup page.
 */
exports.getSignup = (req, res) => {
    res.render('account/signup', {
      title: 'Create Account',
      admin: 'admin'
    });
};

/**
 * POST /signup
 * Create a new local account.
 */
exports.postSignup = (req, res, next) => {
  req.assert('username', 'Username is not valid').notEmpty();
  req.assert('password', 'Password must be at least 4 characters long').len(4);
  req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);

  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/signup');
  }

  const user = new User({
    username: req.body.username,
    password: req.body.password
  });

  User.findOne({ username: req.body.username }, (err, existingUser) => {
    if (existingUser) {
      req.flash('errors', { msg: 'Account with that username already exists.' });
      return res.redirect('/signup');
    }

    user.username = req.body.username;
    user.profile.name = req.body.name || '';
    user.profile.tip = req.body.tip || '';
    user.profile.xml = req.body.xml || '';
    user.profile.roomID = req.body.roomID || '';

    user.save((err) => {
      if (err) { return next(err); }
	    res.redirect('/admin');
    });
  });
};

/**
 * GET /account
 * Profile page.
 */
exports.getAccount = (req, res) => {
 Room.find({}, function(err, rooms) {
    if(!rooms) {
        rooms= [];
        rooms.push({name:"none"});
    }

  res.render('account/profile', {
    title: 'My Account Management',
    admin: 'admin',
    rooms: rooms
  });
});
};

exports.getAccountById = (req, res) => {
  User.findById( req.params.id, function (err, user) {

 Room.find({}, function(err, rooms) {
    if(!rooms) {
        rooms= [];
        rooms.push({name:"none"});
    }

	res.render('account/profilebyid', {
    		title: 'Account Management',
    		admin: 'admin',
            rooms: rooms,
    		edituser: user
  	});
});
  });
};

/**
 * POST /account/profile
 * Update profile information.
 */
exports.postUpdateProfile = (req, res, next) => {
  req.assert('ime', 'Please enter a valid username.').notEmpty();

  const errors = req.validationErrors();
  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/account');
  }

  User.findById(req.user.id, (err, user) => {
    if (err) { return next(err); }
    user.username = req.body.ime || '';
    user.profile.name = req.body.name || '';
    user.profile.tip = req.body.tip || '';
    user.profile.xml = req.body.xml || '';
    user.profile.roomID = req.body.roomID || '';
    user.save((err) => {
      if (err) {
        if (err.code === 11000) {
          req.flash('errors', { msg: 'The username you have entered is already associated with an account.' });
          return res.redirect('/account');
        }
        return next(err);
      }
      req.flash('success', { msg: 'Profile information has been updated.' });
      res.redirect('/admin');
    });
  });
};

/**
 * POST /account/profile
 * Update profile information.
 */
exports.postUpdateProfileById = (req, res, next) => {
  req.assert('ime', 'Please enter a valid username.').notEmpty();

  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/account/' + req.params.id);
  }

  User.findById(req.params.id, (err, user) => {
    if (err) { return next(err); }
    user.username = req.body.ime || '';
    user.profile.name = req.body.name || '';
    user.profile.tip = req.body.tip || '';
    user.profile.xml = req.body.xml || '';
    user.profile.roomID = req.body.roomID || '';
    user.save((err) => {
      if (err) {
        if (err.code === 11000) {
          req.flash('errors', { msg: 'The username you have entered is already associated with an account.' });
          return res.redirect('/account/' + user._id);
        }
        return next(err);
      }
      req.flash('success', { msg: 'Profile information has been updated.' });
      res.redirect('/admin');
    });
  });
};


/**
 * POST /account/password
 * Update current password.
 */
exports.postUpdatePassword = (req, res, next) => {
  req.assert('password', 'Password must be at least 4 characters long').len(4);
  req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);

  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/account');
  }

  User.findById(req.user.id, (err, user) => {
    if (err) { return next(err); }
    user.password = req.body.password;
    user.save((err) => {
      if (err) { return next(err); }
      req.flash('success', { msg: 'Password has been changed.' });
      res.redirect('/account');
    });
  });
};

exports.postUpdatePasswordById = (req, res, next) => {
  req.assert('password', 'Password must be at least 4 characters long').len(4);
  req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);

  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/account/' + req.params.id);
  }

  User.findById(req.params.id, (err, user) => {
    if (err) { return next(err); }
    user.password = req.body.password;
    user.save((err) => {
      if (err) { return next(err); }
      req.flash('success', { msg: 'Password has been changed.' });
      res.redirect('/account/' + req.params.id);
    });
  });
};


/**
 * POST /account/delete
 * Delete user account.
 */
exports.postDeleteAccount = (req, res, next) => {
  User.remove({ _id: req.user.id }, (err) => {
    if (err) { return next(err); }
    req.logout();
    req.flash('info', { msg: 'Your account has been deleted.' });
    res.redirect('/');
  });
};

exports.postDeleteAccountById = (req, res, next) => {

  User.remove({ _id: req.params.id }, (err) => {
    if (err) { return next(err); }
    req.flash('info', { msg: 'Account has been deleted.' });
    res.redirect('/');
  });
};


/**
 * GET /account/unlink/:provider
 * Unlink OAuth provider.
 */
exports.getOauthUnlink = (req, res, next) => {
  const provider = req.params.provider;
  User.findById(req.user.id, (err, user) => {
    if (err) { return next(err); }
    user[provider] = undefined;
    user.tokens = user.tokens.filter(token => token.kind !== provider);
    user.save((err) => {
      if (err) { return next(err); }
      req.flash('info', { msg: `${provider} account has been unlinked.` });
      res.redirect('/account');
    });
  });
};

/**
 * GET /reset/:token
 * Reset Password page.
 */
exports.getReset = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  User
    .findOne({ passwordResetToken: req.params.token })
    .where('passwordResetExpires').gt(Date.now())
    .exec((err, user) => {
      if (err) { return next(err); }
      if (!user) {
        req.flash('errors', { msg: 'Password reset token is invalid or has expired.' });
        return res.redirect('/forgot');
      }
      res.render('account/reset', {
        title: 'Password Reset'
      });
    });
};

/**
 * POST /reset/:token
 */
exports.postReset = (req, res, next) => {
  req.assert('password', 'Password must be at least 4 characters long.').len(4);
  req.assert('confirm', 'Passwords must match.').equals(req.body.password);

  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('back');
  }

  async.waterfall([
    function (done) {
      User
        .findOne({ passwordResetToken: req.params.token })
        .where('passwordResetExpires').gt(Date.now())
        .exec((err, user) => {
          if (err) { return next(err); }
          if (!user) {
            req.flash('errors', { msg: 'Password reset token is invalid or has expired.' });
            return res.redirect('back');
          }
          user.password = req.body.password;
          user.passwordResetToken = undefined;
          user.passwordResetExpires = undefined;
          user.save((err) => {
            if (err) { return next(err); }
            req.logIn(user, (err) => {
              done(err, user);
            });
          });
        });
    },
    function (user, done) {
      const transporter = nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: process.env.SENDGRID_USER,
          pass: process.env.SENDGRID_PASSWORD
        }
      });
      const mailOptions = {
        to: user.email,
        from: 'hackathon@starter.com',
        subject: 'Your Hackathon Starter password has been changed',
        text: `Hello,\n\nThis is a confirmation that the password for your account ${user.email} has just been changed.\n`
      };
      transporter.sendMail(mailOptions, (err) => {
        req.flash('success', { msg: 'Success! Your password has been changed.' });
        done(err);
      });
    }
  ], (err) => {
    if (err) { return next(err); }
    res.redirect('/');
  });
};


