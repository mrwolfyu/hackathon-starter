const config = require('../.config.json');
const crypto = require('crypto');
const request = require('request');
const parser = require('xml2json');

urlbuilder = exports.urlbuilder = (action, params) => {
    var shasum = crypto.createHash('sha1');
    var ret = "http://" + config.BBB_IP  + config.BBB_URL + "/api/";
    var check =  action + params + config.BBB_SECRET ;
    shasum.update(check);
    if(params == '') {return ret + action + '?' + 'checksum='+shasum.digest('hex'); }
    return ret + action + '?' + params + '&checksum='+shasum.digest('hex');
};

bbbcreate = exports.bbbcreate = (req, res, room , next) => {
        var roompw=room.attendeePW;
        if( req.user.profile.tip  === 'moderator' || req.user.profile.tip  === 'admin' ) {roompw=room.moderatorPW;}
                //CREATE
                params='meetingID='+ encodeURIComponent(room.meetingID)
                      +'&name='+ encodeURIComponent(room.fullName)
                      +'&moderatorPW='+ encodeURIComponent(room.moderatorPW)
                      +'&attendeePW='+ encodeURIComponent(room.attendeePW)
                      +'&welcome=' + encodeURIComponent(room.welcome)
                      +'&meta_currentDate=' + encodeURIComponent(Date().toString()),
                      +'&meta_org=SMATSA',
                      + encodeURIComponent('&meta_author=Marko Dzida'),
                      +"&allowStartStopRecording=false&autoStartRecording=true&record=true";
            
                url = urlbuilder('create',params);
                request(url, function (error, response, body) {
                    if ((error && response.statusCode == 200 ) || JSON.parse(parser.toJson(body)).response.returncode != 'FAILED') {
                        return next('');
                            }
                    else {
                        return next(error);
                    }

                    });
};

exports.bbbjoin = (req, room, next) => {
    bbbgetMeetingsById(room.meetingID, (err, meetings) => {
        if(err) { return next(err);}
        else {
            var roompw=room.attendeePW;
            if( req.user.profile.tip  === 'moderator' || req.user.profile.tip  === 'admin' ) {
                roompw=room.moderatorPW;
            }
            url = urlbuilder('join','meetingID='+room.meetingID+'&password='+ roompw + '&fullName=' +req.user.profile.name +'&redirect=true');
            return next('', url);
        }
    });
};

bbbgetMeetingsById = exports.bbbgetMeetingsById = ( id, next) => {
    var meetings = [];
    var url = urlbuilder('getMeetingInfo','meetingID='+id);
    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200 ) {
            var jsons = parser.toJson(body);
            meetings = (JSON.parse(jsons)).response;
            if (meetings.returncode == 'FAILED') {return next("ERROR");}
            else return next('',meetings);

        } else {
            return next(error);    
        }
      });
};

exports.bbbend = (id, next) => {
    bbbgetMeetingsById(id, (err, meetings) => {
        if(err) { return next(err);}
        else {
            var url = urlbuilder('end','meetingID='+ meetings.meetingID + "&password="+meetings.moderatorPW);
            request(url, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    if ((JSON.parse(parser.toJson(body))).response.returncode == 'FAILED') {return next("ERROR");}
                    else return next('') ;
                } else {
                    return next(error);
                }
            });
       }
    });
};

