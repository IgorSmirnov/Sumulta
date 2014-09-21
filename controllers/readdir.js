var fs = require('fs');

module.exports = function()
{
	var result = [];
	for(var a in arguments)
	{
		var path = arguments[a];
        if(path.substr(path.length - 3) === '.js')
        {
            result.push(path);
            continue;
        }
		var files = fs.readdirSync(arguments[a]);
		var index = null;
		for(var s in files)
		{
			if(files[s] === 'test.js') continue;
			if(files[s] === 'index.js') index = path + files[s];
			else result.push(path + files[s]);
		}
		if(index) result.push(index);
	}
	for(var x in result) /*if(result[x].charAt[0] === '.')*/ result[x] = result[x].substr(1);
	return result;
};