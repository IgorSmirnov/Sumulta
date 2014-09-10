'use strict';

var log = require('winston');

module.exports = function(req, res, next)
{
	var auth = req.isAuthenticated();
    if(auth)
    { 
    	log.info('User', req.user.username, req.method, req.url);
    	next();
    }
    else
    {
    	res.statusCode = 401;
    	res.json({result:'unauthorized'});
    	log.warn('Unauthorized ' + req.method + ' to ' + req.url);
    } 
}