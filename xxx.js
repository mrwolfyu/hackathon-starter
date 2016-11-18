onst bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');


console.log('start');

bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash('passwd', salt, null, (err, hash) => {
      console.log(hash);
    });
  });


