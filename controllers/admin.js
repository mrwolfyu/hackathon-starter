/**
 * GET /
 * Home page.
 */


var config = require('../.config.json')

exports.index = (req, res) => {
  res.render('admin', {
    title: 'Admin',
    admin: 'admin',
    LOCATION: config.LOCATION
  });
};
