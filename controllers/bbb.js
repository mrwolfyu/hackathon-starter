/**
 * GET /
 * BBB page.
 */

const config = require('../.config.json');
const crypto = require('crypto');
const request = require('request');
const parser = require('xml2json');
const moment = require('moment');
const utils = require('./utils');

exports.index = (req, res) => {
    var meetings = [];
    var recordings = [];
    var pRec = new Promise((resolve, reject) =>{
        utils.bbbgetRecordings( (err, meetings) => {
            if(err) reject(err);
            else resolve(meetings);
        });
    });
    var pGet = new Promise((resolve,reject) => {
        utils.bbbgetMeetings( (err, meetings) => {
            if(err) reject(err);
            else resolve(meetings);
        });
    });

    Promise.all([pGet,pRec]).then( value => {
        res.render('bbbapi/bbbapi', {
                        title: 'BBB',
                        meetings: value[0],
                        moment: moment,
                        recordings: value[1],
                        admin: 'admin',
                        LOCATION: config.LOCATION
                    });
    }, reason => {
        req.flash('errors', { msg: 'ERROR! Can\'t run getMeetins/getRedordings. ' + reason});
    });
};

exports.getRecordings = (req, res) => {
    var recordings = [];
    var url = utils.urlbuilder('getRecordings','');

    var pRec = new Promise((resolve, reject) =>{
        utils.bbbgetRecordings( (err, meetings) => {
            if(err) reject(err);
            else resolve(meetings);
        });
    });
    pRec.then( value => {
        res.render('bbbapi/recording', {
                title: 'recording',
                recordings: value,
                admin: 'admin',
                moment: moment,
                LOCATION: config.LOCATION
            });
    } , reason=> {
        req.flash('errors', { msg: 'ERROR! Can\'t find getRecordings.' + reason });
    });
};

exports.getMeetingsById = (req, res) => {

    utils.bbbgetMeetingsById(req.params.id, (err, meetings) => {
        if(err) {
            req.flash('errors', { msg: 'ERROR! Can\'t find getMeetings.' });
        } else {
            res.render('bbbapi/meetingbyid', {
                title: 'meeting',
                meetings: meetings,
                json: JSON.stringify(meetings, null, 4),
                admin: 'admin',
                LOCATION: config.LOCATION
            });
        }
    });
};

exports.deleteMeetingsById = (req, res) => {

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
};

exports.getRecordingsById = (req, res) => {
    var recordings = [];
    var pRec = new Promise((resolve, reject) =>{
        utils.bbbgetRecordingsById(req.params.id, (err, meetings) => {
            if(err) reject(err);
            else resolve(meetings);
        });
    });
    pRec.then( value => {
            res.render('bbbapi/recordingbyid', {
                title: 'recording',
                recordings: value,
                admin: 'admin',
                LOCATION: config.LOCATION
            });

      } , reason =>  {
            req.flash('errors', { msg: 'ERROR! Can\'t run getRecordings.'+ reason }); 
      });
};

exports.getMeetings = (req, res) => {
    var meetings;
    var pGet = new Promise((resolve,reject) => {
        utils.bbbgetMeetings( (err, meetings) => { 
            if(err) reject(err);
            else resolve(meetings);
        });
    });
    pGet.then( value => {
        res.render('bbbapi/meeting', {
                title: 'meeting',
                meetings: value,
                admin: 'admin',
                LOCATION: config.LOCATION
            });
    } , reason=> {
        req.flash('errors', { msg: 'ERROR! Can\'t find getMeetings.' + reason });
    });
};

exports.actRecordingsById =(req, res) =>{
    if(req.params.action == 'publish') {
       var url = utils.urlbuilder('publisRecordings','publish=true&recordID='+ req.params.id);
        request({url: url, method: 'POST'}, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                req.flash('success', { msg: 'REC PUBLISHED.' });
                return res.redirect('/recording');
            }
            else {
                req.flash('errors', { msg: 'ERROR! Can\'t publish Recording.' });
                return res.redirect('/recording');
            }
        }); 
    } else if(req.params.action == 'unpublish') {
       var url = utils.urlbuilder('publisRecordings','publish=false&recordID='+ req.params.id);
        request({url: url, method: 'POST'}, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                req.flash('success', { msg: 'REC PUBLISHED.' });
                return res.redirect('/recording');
            }
            else {
                req.flash('errors', { msg: 'ERROR! Can\'t publish Recording.' });
                return res.redirect('/recording');
            }
        });
    } else if (req.params.action == 'delete') {
        var url = utils.urlbuilder('deleteRecordings','recordID='+ req.params.id);
        request({url: url, method: 'POST'}, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                req.flash('success', { msg: 'REC DELETED.' });
                return res.redirect('/recording');
            }
            else {
                req.flash('errors', { msg: 'ERROR! Can\'t delete Recording.' });
                return res.redirect('/recording');
            }
        });
    }
    else {
         return res.redirect('/recording'); 
    }
};

exports.playRecordingsById = (req, res) => {
    var recordings = [];
    var recordID = req.params.id;
    var orig = req.params.orig;
    var BBB_VIDEO = 'http://' + config.BBB_IP + config.BBB_VIDEO.replace('SUBrecordID', recordID); 

    var pRec = new Promise((resolve, reject) =>{
        utils.bbbgetRecordingsById(recordID, (err, meetings) => {
            if(err) reject(err);
            else resolve(meetings);
        });
    });
    pRec.then( value => {
        if( orig == 'video' ) {
            return res.redirect(BBB_VIDEO);
        }
        if( orig == 'custom') {
            return res.redirect('/recording');
        }  
        return res.redirect(value.playback.format.url);
      } , reason =>  {
            req.flash('errors', { msg: 'ERROR! Can\'t run getRecordings.' });
    });
};

