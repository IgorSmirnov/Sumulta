'use strict';

var crypto = require('crypto');

module.exports = function(user, pass) 
{
	return crypto.createHash('md5').update('salt').update(user).update(pass).digest('base64');
};
