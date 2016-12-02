const async = require('async');
const crypto = require('crypto');
const passport = require('passport');
const Room = require('../models/Room');




exports.getRoom = (req, res) => {
    
    res.render('room/create', {
      title: 'Room Management',
      admin: 'admin'
    });
};

/**
 * POST /signup
 * Create a new local account.
 */
exports.postRoom = (req, res, next) => {
  req.assert('name', 'Name is not valid').notEmpty();
  req.assert('meetingID', 'meetingID is not valid').notEmpty();
  req.assert('attendeePW', 'Password must be at least 4 characters long').len(4);
  req.assert('moderatorPW', 'Password must be at least 4 characters long').len(4);

  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/roomc');
  }

  const room = new Room({
    name: req.body.name,
    meetingID: req.body.meetingID
  });

  Room.findOne({ meetingID: req.body.meetingID }, (err, existingUser) => {
    if (existingUser) {
      req.flash('errors', { msg: 'Room with that meetingID already exists.' });
      return res.redirect('/roomc');
    }
    console.log(req.body.meetingID);
    room.meetingID = req.body.meetingID ;
    console.log(room.meetingID);
    room.name = req.body.name || '';
    room.record = req.body.record || '';
    room.autoStartRecording = req.body.autoStartRecording || '';
    room.allowStartStopRecording = req.body.allowStartStopRecording || '';
    room.recordID = req.body.recordID || '';
    room.xml = req.body.xml || '';
    room.author = req.body.author || '';
    room.attendeePW = req.body.attendeePW || '';
    room.fullName = req.body.fullName || '';
    room.publish = req.body.publish || '';
    room.moderatorPW = req.body.moderatorPW || '';
    room.welcome = req.body.welcome || '';

    room.save((err) => {
      if (err) { return next(err); }
        req.flash('success', { msg: 'Success! You created a room/meeting.' });
        res.redirect('/admin');
    });
  });
};

exports.postRoomById = (req, res, next) => {
  req.assert('name', 'Name is not valid').notEmpty();
  req.assert('meetingID', 'meetingID is not valid').notEmpty();
  req.assert('attendeePW', 'Password must be at least 4 characters long').len(4);
  req.assert('moderatorPW', 'Password must be at least 4 characters long').len(4);

  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/roomc');
  }

  const room = new Room({
    name: req.body.name,
    meetingID: req.body.meetingID
  });

   Room.findById(req.params.id, (err, room) => {
    if (err) { return next(err); }
    console.log(req.body.meetingID);
    room.meetingID = req.body.meetingID ;
    console.log(room.meetingID);
    room.name = req.body.name || '';
    room.record = req.body.record || '';
    room.autoStartRecording = req.body.autoStartRecording || '';
    room.allowStartStopRecording = req.body.allowStartStopRecording || '';
    room.recordID = req.body.recordID || '';
    room.xml = req.body.xml || '';
    room.author = req.body.author || '';
    room.fullName = req.body.fullName || '';
    room.publish = req.body.publish || '';
    room.attendeePW = req.body.attendeePW || '';
    room.moderatorPW = req.body.moderatorPW || '';
    room.welcome = req.body.welcome || '';
    room.save((err) => {
      if (err) { return next(err); }
        req.flash('success', { msg: 'Success! You updated a room/meeting.' });
        res.redirect('/admin');
    });
  });
};




exports.getRoomById = (req, res) => {
  Room.findById( req.params.id, function (err, room) {
	res.render('room/update', {
    		title: 'Room Management',
    		admin: 'admin',
    		room: room
  	});
  });
};

exports.postDeleteRoomById = (req, res, next) => {

  Room.remove({ _id: req.params.id }, (err) => {
    if (err) { return next(err); }
    req.flash('info', { msg: 'Room has been deleted.' });
    res.redirect('/');
  });
};


