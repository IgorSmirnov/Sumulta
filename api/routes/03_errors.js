'use strict';

var express = require('express');
var log		= require('winston');

module.exports = function(app)
{
    // URL not found
    app.use(function(req, res, next)
    {
    	res.status(404);
    	log.debug('URL not found:', req.url);
    	res.json({result: 'error', message: 'URL not found'});
    });
    // Server internal error
    app.use(function(err, req, res, next)
    {
    	res.status(err.status || 500);
    	log.error('Internal error(%d): %s', res.statusCode, err.message);
    	res.json({result: 'error', message: err.message});
    });
};