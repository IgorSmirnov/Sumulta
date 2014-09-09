'use strict';

var log			= require('winston');
var mongoose    = require('mongoose');
var requireTree = require('require-tree');
var models      = requireTree('../models/');
var url			= require('nconf').get('mongoose:url');

mongoose.connection.on('open', function()
{
	log.info('Connected to mongodb server.');
});

mongoose.connection.on('error', function(err)
{
	log.error('Could not connect to mongodb server.');
	process.exit(1);
});

try
{
    mongoose.connect(url);
    log.info('Started connection to ' + url + ', waiting for open');
} 
catch(e)
{
	log.error('Error while connecting to mongodb:', e);
	process.exit(1);
}
