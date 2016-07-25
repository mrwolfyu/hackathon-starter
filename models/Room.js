const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  meetingID: { type: String, unique: true },
  recordID: { type: String, default: '' },
  attendeePW: { type: String, default: '' },
  moderatorPW: { type: String, default: '' },
  fullName: { type: String, default: '' },
  name: { type: String, default: '' },
  author: { type: String, default: '' },
  welcome: { type: String, default: '' },
  record: { type: String, default: '' },
  publish: { type: String, default: '' },
  autoStartRecording: { type: String, default: '' },
  allowStartStopRecording: { type: String, default: '' },
  xml: { type: String, default: '' }
}, { timestamps: true });

/**
 * Password hash middleware.
 */
roomSchema.pre('save', function (next) {
//  const Room = this;
  next();
});

/**
 * Helper method for validating user's password.
 */

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;
