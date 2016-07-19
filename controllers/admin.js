/**
 * GET /
 * Home page.
 */


var config = require('../.config.json')
const User = require('../models/User'); 
const Room = require('../models/Room');

exports.index = (req, res) => {
  User.find({}, function (err, user){  
  	Room.find({}, function (err, room){
		if(typeof(room) == 'undefined') { room=[] ; room.push({name: "asd", meetingID : "asd"});}
		res.render('admin', {
    			title: 'Admin',
    			admin: 'admin',
    			users: user,
			rooms: room,
    			LOCATION: config.LOCATION
  		});
	});

  }); 
};
