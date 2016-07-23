/**
 * GET /
 * Home page.
 */


const config = require('../.config.json');
const crypto = require('crypto');
const request = require('request');
const parser = require('xml2json');
const Room = require('../models/Room');
const utils = require('./utils');

//    return ret + action + '?' + encodeURIComponent(params) + 'checksum='+shasum.digest('hex');
        
exports.index = (req, res) => {

    console.log('mar'==='mar');
  if(req.user.profile.tip === 'admin') {
	return res.redirect('/admin');
  }
  else {


    if(req.user.profile.tip === 'moderator' || req.user.profile.tip === 'attendee') {
            Room.findById(req.user.profile.roomID, function (err, room){

               return  utils.bbbjoin(req,res,room); 
                
            });
 
    }
    return res.redirect('/admin');
/*
    res.render('home', {
        title: 'Home',
        admin: 'no',
        LOCATION: config.LOCATION
     });
//*/
    }
};
