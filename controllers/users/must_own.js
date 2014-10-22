'use strict';

var log = require('winston');

// TODO: Написать must_own

module.exports = function(req, res, next)
{
	var auth = req.isAuthenticated();
    if(auth)
    { 
        if(req.params.owner !== req.user.name)
        {
            log.info('Forbidden: User', req.user.name, 'try to', req.method, req.url);
            res.status(403);
            res.json({result:'forbidden'});
        } else next();
    }
    else
    {
    	res.status(401);
    	res.json({result:'unauthorized'});
    	log.warn('Unauthorized ' + req.method + ' to ' + req.url);
    } 
}