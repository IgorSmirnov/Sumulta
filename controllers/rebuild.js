'use strict';

var log    = require('winston');
var config = require('nconf');
var exec   = require('child_process').exec;

module.exports = function(req, res, next)
{
	log.info('Rebuild started');
	var closure = config.get('closure:command');
	var query = closure + ' --js js/core/*.js --js_output_file js/core.js';
	log.info(query);
	exec(query, {encoding: 'binary'},
		function (error, stdout, stderr) 
		{
			res.json({stdout: stdout, stderr: stderr});
    		console.log('stdout: ' + stdout);
    		console.log('stderr: ' + stderr);
    		if (error !== null) {
      			console.log('exec error: ' + error);
      		}
    	});
}