'use strict';

var log = require('winston');

module.exports = function(req, res, next)
{
	var auth = req.isAuthenticated();
    if(auth)
    { 
    	log.info('User', req.user.name, req.method, req.url);
    	res.json({auth: true, name: req.user.name, rights: req.user.rights});
    }
    else
    {
    	res.json({auth: false, name: 'guest', rights: ''});
    	log.warn('Unauthorized ' + req.method + ' to ' + req.url);
    } 
}