/**
 * GET /
 * Home page.
 */


const config = require('../.config.json');
const crypto = require('crypto');
const parser = require('xml2json');
const Room = require('../models/Room');
const User = require('../models/User');
const utils = require('./utils');
const request = require('request');



confjoin = (req, res, room) => {
    utils.bbbjoin(req, room, (err, url) => {
        if(err) {
            req.flash('errors', { msg: 'ERROR! Can\'t joint to the meeting.' });
            if(req.user.profile.tip != 'admin') {
                req.logout();
                res.redirect('/');        
            }
        } else {
            res.redirect(url);
        }
    });
}; 


createandjoin = (req,res,room) => {
    utils.bbbgetMeetingsById(room.meetingID, (err, meetings) => {
        if(err) {
             utils.bbbcreate(req, res, room ,(err) =>{
                 if(err) { return ;}
                 else {confjoin(req,res,room);}
             });
         } else {
             confjoin(req,res,room);
         }
    });
};

exports.adminindex = (req, res) => {
    var pRoom = new Promise((resolve, reject) => {
        Room.find({}, function (err, room){
        if(typeof(room) == 'undefined') { room=[] ; room.push({name: "asd", meetingID : "asd"});}
            if(err) reject(err);
            else resolve(room);
        });
    });
    var pUser = new Promise( (resolve, reject) => {
        User.find({}, function (err, user){
            if(err) reject(err);
            else resolve(user);
        });
    });
    
    Promise.all([pRoom, pUser]).then( value => {
        res.render('admin', {
                title: 'Admin',
                admin: 'admin',
                users: value[1],
                rooms: value[0],
                LOCATION: config.LOCATION
        });
    }, reason => {
        req.flash('errors', { msg: 'ERROR! Can\'t get db.' });
    });
};

exports.join = (req, res) => {
    Room.findById(req.params.id, function (err, room){
        createandjoin(req, res,room);
    });            
};

exports.joinbymid = (req, res) => {
    utils.bbbgetMeetingsById(req.params.id, (err, meetings) => {
        if(err) return req.flash('errors', { msg: 'ERROR! Can\'t get meeting.' });
        else {
            Room.findById(meetings.metadata.roomid, function (err, room){
                createandjoin(req, res,room);
            });   
        }
    });         
};
exports.create = (req, res) => {
    Room.findById(req.params.id, function (err, room){
        utils.bbbcreate(req, res, room ,(err) =>{
            if(err) { req.flash('errors', { msg: 'ERROR! Can\'t create the meeting.' });}
            else {
                req.flash('success', { msg: 'MEETING CREATED.' });
                res.redirect('/meeting');
            }
        });
    });
};


/*
  utils.bbbend(req.params.id, (err, next) => {
        if(err) {
            req.flash('errors', { msg: 'ERROR! Can\'t delete getMeeting.' });
            return res.redirect('/meeting');
        }
        else {
            req.flash('success', { msg: 'Meeting deleted.' });
            return res.redirect('/meeting');
       }
    });

*/
exports.index = (req, res) => {
    if(typeof(req.headers.referer) != 'undefined') { 
        if(req.headers.referer.toString().match(/client\/BigBlueButton.html/)) {
            // LOGOUT ZA BigBlueButton
            console.log(req.user);
            Room.findById(req.user.profile.roomID, function (err, room){
                if(err) reject(err);
                else { 
                    utils.bbbgetMeetingsById(room.meetingID, (err, meetings) => {
                        if(err) reject(err);
                        else {
                            console.log(meetings); 
                            if (parseInt(meetings['participantCount']) < 1 || parseInt(meetings['moderatorCount']) < 1 ){
                                utils.bbbend(meetings['meetingID'], (err, next) => {
                                });
                            }
                        }
                    });  
                }
            });
            
            req.logout();
            req.flash();
            return res.redirect('/login');
        }
    }
//*/
  if(req.user.profile.tip === 'admin') {
	return res.redirect('/admin');
  }
  else {
    if(req.user.profile.tip === 'moderator' || req.user.profile.tip === 'attendee') {
            Room.findById(req.user.profile.roomID, function (err, room){
                createandjoin(req, res,room);  
            }); 
    }
  }
};
