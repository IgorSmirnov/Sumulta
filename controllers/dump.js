'use strict';

var log      = require('winston');

module.exports = function(req, res, next)
{
    if(req.isAuthenticated())
        log.info('User', req.user.name, req.method, req.url);
    else
        log.info('Unauthorized ' + req.method + ' to ' + req.url);
    next();
}
