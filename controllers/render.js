'use strict';

module.exports = function(template, variables)
{
	return function(req, res)
	{
		var vars = {user:{name:'guest', rights:''}};
		for(var x in variables) vars[x] = variables[x];
		if(req.isAuthenticated())
		{
			vars.user.name = req.user.name;
			vars.user.rights = 'save';
		} 
		res.render(template, vars);
	}
}