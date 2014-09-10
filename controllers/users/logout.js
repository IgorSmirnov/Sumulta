'use strict';

var log = require('winston');

module.exports = function(req, res, err)
{
	if(req.user) log.info('User ' + req.user.username + ' unathorized');
    req.logout();
    res.json({result: 'unathorized'});
}