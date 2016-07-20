/**
 * GET /
 * Home page.
 */


const config = require('../.config.json');
const crypto = require('crypto');
const request = require('request');
const parser = require('xml2json');

urlbuilder = (action, params) => {
    var shasum = crypto.createHash('sha1');
    shasum.update(action+config.BBB_SECRET);
    var ret = config.BBB_URL;
    if (! ret.indexOf('api') >= 0) {
        ret = config.BBB_URL + 'api/';
    } 
    return ret + action + '?' + encodeURIComponent(params) + 'checksum='+shasum.digest('hex');
}

exports.index = (req, res) => {
  if(req.user.profile.tip === 'admin') {
	res.redirect('/admin');
  }
  else {
    
     var url = urlbuilder('getMeetings','');
    //console.log('******* ' + url);
    request(url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
       body = parser.toJson(body);
       /* request('http://10.250.2.215/bigbluebutton/api/enter', function (error2, response2, body2) {
          if (!error && response.statusCode == 200) {
            res.contentType('application/json');
            res.send(JSON.stringify({username: req.query.username, meetingID: req.query.meetingID }));
          }
        }) //*/
       console.log(body);
      } else {
            console.log("jeb ga *****");
       } 
    });

  url = urlbuilder('getRecordings','');
    //console.log('******* ' + url);
    request(url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var recs = (JSON.parse(parser.toJson(body))).response.recordings.recording;
       /* request('http://10.250.2.215/bigbluebutton/api/enter', function (error2, response2, body2) {
          if (!error && response.statusCode == 200) {
            res.contentType('application/json');
            res.send(JSON.stringify({username: req.query.username, meetingID: req.query.meetingID }));
          }
        }) //*/
       console.log(recs);
      } else {
            console.log("jeb ga *****");
       }
    });

    res.render('home', {
        title: 'Home',
        admin: 'no',
        LOCATION: config.LOCATION
     });
    }
};
