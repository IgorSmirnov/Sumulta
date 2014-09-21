'use strict';

var log = require('winston');

module.exports = function(req, res, err)
{
	if(req.user) log.info('User ' + req.user.name + ' unathorized');
    req.logout();
    res.json({result: 'unathorized'});
}