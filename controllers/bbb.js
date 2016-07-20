/**
 * GET /
 * BBB page.
 */


const config = require('../.config.json');
const crypto = require('crypto');
const request = require('request');
const parser = require('xml2json');

urlbuilder = (action, params) => {
    var shasum = crypto.createHash('sha1');
    var ret = config.BBB_URL;
    if (! ret.indexOf('api') >= 0) {
        ret = config.BBB_URL + 'api/';
    } 
    shasum.update(action+params+config.BBB_SECRET);
    if(params == '') {return ret + action + '?' + 'checksum='+shasum.digest('hex'); }
    
    return ret + action + '?' + params + '&checksum='+shasum.digest('hex');
}

exports.index = (req, res) => {
    var meetings = [];
    var recordings = [];
    var url = urlbuilder('getMeetings','');
    //console.log('******* ' + url);
    request(url, function (error, response, bodym) {


      if (!error && response.statusCode == 200) {

            var meetings = (JSON.parse(parser.toJson(bodym))).response.meetings;

            if (!meetings){
                meetings=[];
            };
        
            
            var url = urlbuilder('getRecordings','');
            request(url, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                recordings = (JSON.parse(parser.toJson(body))).response.recordings.recording;
                    if(!recordings) {
                        recordings = [];
                    }
                    res.render('bbbapi/bbbapi', {
                        title: 'BBB',
                        meetings: meetings,
                        recordings: recordings,
                        admin: 'admin',
                        LOCATION: config.LOCATION
                    });

                //console.log(recordings[0].playback);
              } else {
                    console.log("jeb ga *****");
                    req.flash('errors', { msg: 'ERROR! Can\'t run getRedordings.' })
                       }
                });

      } else {
            console.log("jeb ga *****");
            req.flash('errors', { msg: 'ERROR! Can\'t run getMeetings.' })
       } 
    });
};

exports.getRecordings = (req, res) => {
    var recordings = [];
    var url = urlbuilder('getRecordings','');
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
                LOCATION: config.LOCATION
            });

      } else {
            //console.log("jeb ga *****");
            req.flash('errors', { msg: 'ERROR! Can\'t run getRecordings.' }); 
            }
      });
};

exports.getMeetingsById = (req, res) => {
    var meetings = [];
    var url = urlbuilder('getMeetingInfo','meetingID='+req.params.id+'&password=mp');
    request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        var jsons = parser.toJson(body);
        meetings = (JSON.parse(jsons)).response;
console.log(meetings);
            if(!meetings) {
                meetings = [];
            }
            //res.redirect('/meeting');
            //return;
            res.render('bbbapi/meetingbyid', {
                title: 'meeting',
                meetings: meetings,
                json: jsons,
                admin: 'admin',
                LOCATION: config.LOCATION
            });

      } else {
            //console.log("jeb ga *****");
            req.flash('errors', { msg: 'ERROR! Can\'t run getMeetings.' }); 
            }
      });
};


exports.getRecordingsById = (req, res) => {
    var recordings = [];
    var url = urlbuilder('getRecordings','recordID='+req.params.id);
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
            //console.log("jeb ga *****");
            req.flash('errors', { msg: 'ERROR! Can\'t run getRecordings.' }); 
            }
      });
};

exports.getMeetings = (req, res) => {
    var meetings;
    var url = urlbuilder('getMeetings','');
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
            //console.log("jeb ga *****");
            req.flash('errors', { msg: 'ERROR! Can\'t run getMeetings.' }); 
            
            }
      });
};

