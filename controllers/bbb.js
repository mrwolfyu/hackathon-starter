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
    var url = utils.urlbuilder('getMeetings','');
    request(url, function (error, response, bodym) {
      if (!error && response.statusCode == 200) {
            var meetings = (JSON.parse(parser.toJson(bodym))).response.meetings;

            if (!meetings){
                meetings=[];
            };
        
            
            var url = utils.urlbuilder('getRecordings','');
            request(url, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                recordings = (JSON.parse(parser.toJson(body))).response.recordings.recording;
                    if(!recordings) {
                        recordings = [];
                    }
                    res.render('bbbapi/bbbapi', {
                        title: 'BBB',
                        meetings: meetings,
                        moment: moment,
                        recordings: recordings,
                        admin: 'admin',
                        LOCATION: config.LOCATION
                    });

              } else {
                    req.flash('errors', { msg: 'ERROR! Can\'t run getRedordings.' });
                       }
                });

      } else {
            req.flash('errors', { msg: 'ERROR! Can\'t run getMeetings.' })
       } 
    });
};

exports.getRecordings = (req, res) => {
    var recordings = [];
    var url = utils.urlbuilder('getRecordings','');
    request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        recordings = (JSON.parse(parser.toJson(body))).response.recordings.recording;
            if(!recordings) {
                recordings = [];
            }
            res.render('bbbapi/recording', {
                title: 'recording',
                recordings: recordings,
                admin: 'admin',
                moment: moment,
                LOCATION: config.LOCATION
            });

      } else {
            req.flash('errors', { msg: 'ERROR! Can\'t run getRecordings.' }); 
            }
      });
};

exports.getMeetingsById = (req, res) => {

    utils.bbbgetMeetingsById(req.params.id, (err, meetings) => {
        if(err) {
            req.flash('errors', { msg: 'ERROR! Can\'t run getMeetings.' });
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
    var url = utils.urlbuilder('getRecordings','recordID='+req.params.id);
    request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        var jsons = parser.toJson(body);
        recordings = (JSON.parse(jsons)).response.recordings.recording;
            if(!recordings) {
                recordings = [];
            }
            //res.redirect('/recording');
            //return;
            res.render('bbbapi/recordingbyid', {
                title: 'recording',
                recordings: recordings,
                admin: 'admin',
                LOCATION: config.LOCATION
            });

      } else {
            req.flash('errors', { msg: 'ERROR! Can\'t run getRecordings.' }); 
            }
      });
};

exports.getMeetings = (req, res) => {
    var meetings;
    var url = utils.urlbuilder('getMeetings','');
    request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        meetings = (JSON.parse(parser.toJson(body))).response.meetings;
            res.render('bbbapi/meeting', {
                title: 'meeting',
                meetings: meetings,
                admin: 'admin',
                LOCATION: config.LOCATION
            });
      } else {
            req.flash('errors', { msg: 'ERROR! Can\'t run getMeetings.' }); 
            
            }
      });
};

exports.playRecordingsById = (req, res) => {
    var recordings = [];
    var recordID = req.params.id;
    var orig = req.params.orig;
    var BBB_VIDEO = 'http://' + config.BBB_IP + config.BBB_VIDEO.replace('SUBrecordID', recordID); 
    var url = utils.urlbuilder('getRecordings','recordID='+ recordID);
    request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        var jsons = parser.toJson(body);
        recordings = (JSON.parse(jsons)).response.recordings.recording;
        if(!recordings) {
            recordings = [];
        }
        if( orig == 'video' ) {
            return res.redirect(BBB_VIDEO);
        }
        if( orig == 'custom') {
            return res.redirect('/bbb');
        }  
        return res.redirect(recordings.playback.format.url);
      } else {
            req.flash('errors', { msg: 'ERROR! Can\'t run getRecordings.' }); 
            }
      });
};


