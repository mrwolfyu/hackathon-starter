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
    res.render('home', {
        title: 'Home',
        admin: 'no',
        LOCATION: config.LOCATION
     });
    }
};
