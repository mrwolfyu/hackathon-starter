/**
 * GET /
 * Home page.
 */


var config = require('../../.config.json')
const User = require('../../models/User'); 
const Room = require('../../models/Room');
const utils = require('./../utils');

exports.index = (req, res) => {
    if(req.params.id=='getusers'){
        var pUser = new Promise( (resolve, reject) => {
            User.find({}, function (err, user){ 
                if(err) reject(err);
                else resolve(user);
            });
        }).then( value => {
            return res.send( JSON.stringify(value));
        } , reason => {
            console.error('rejected ' + err);
        }); 
    } else
    if(req.params.id=='getrooms'){
        var pRoom = new Promise( (resolve, reject) => {
            Room.find({}, function (err, room){ 
                if(err) reject(err);
                else resolve(room);
            });
        }).then( value => {
            return res.send( JSON.stringify(value));
        } , reason => {
            console.error('rejected ' + err) ;
        });
    } else
    res.send(JSON.stringify([{}]));
};

