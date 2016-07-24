/**
 * GET /
 * Home page.
 */


var config = require('../.config.json')
const User = require('../models/User'); 
const Room = require('../models/Room');
const utils = require('./utils');

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

exports.join = (req, res) => {

    Room.findById(req.user.profile.roomID, function (err, room){

                return utils.bbbjoin(req,res, room);



            });

};

exports.create = (req, res) => {

    Room.findById(req.user.profile.roomID, function (err, room){

                return utils.bbbcreate(req,res,room);

            });
return;
//    return res.redirect('/admin');
};


