/**
 * GET /
 * Home page.
 */


var config = require('../.config.json')
const bbb = require('../mylibs/bigbluebutton');




exports.index = (req, res) => {
  if(req.user.profile.tip === 'admin') {
	res.redirect('/admin');
  }
  else {
    bbb.url = config.BBB_URL;
    bbb.salt = config.BBB_SECRET;
    

    data = {
        action: 'getMeetings'
    };


    
    res.render('home', {
        title: 'Home',
        admin: 'no',
     
        LOCATION: config.LOCATION
     });
    }
};
