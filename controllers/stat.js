'use strict';

var fs = require('fs');

module.exports = function(filename)
{
	var file = fs.readFileSync(filename, {encoding: 'utf-8'});
	return function(req, res)
	{
		res.send(file);
	}
}