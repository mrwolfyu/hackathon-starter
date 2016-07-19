/**
 * GET /
 * Home page.
 */


var config = require('../.config.json')

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
