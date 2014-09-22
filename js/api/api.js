var api = new (function()
{
	this.getUsers = function(func, query)
	{
		function cb(status, text) {
			var err = (status === 200) ? null : status;
			var data = JSON.parse(text);

			func(err, data);
		}
		ajax.get('/users', {
			cb: cb, query:query});
	};
	this.getProjects = function(func, query)
	{
		function cb(status, text) {
			var err = (status === 200) ? null : status;
			var data = JSON.parse(text);

			func(err, data);
		}
		ajax.get('/projects', {
			cb: cb, query:query});
	};
	this.getNews = function(func, query)
	{
		function cb(status, text) {
			var err = (status === 200) ? null : status;
			var data = text ? JSON.parse(text) : {};

			func(err, data);
		}
		ajax.get('/news', {
			cb: cb, query:query});
	};
	function byId(id) { return document.getElementById(id);}
	this.register = function()
	{
		var user = byId('reguser').value;
		var pass = byId('regpass').value;
		var pass2 = byId('regpass2').value;
		//if(pass !== pass2) return;
		ajax.post('/auth/register', {
			data:{username: user, password: pass},
			cb: function(status, text)
			{
				var data = JSON.parse(text);
				switch(data.result)
				{
					case 'registered': location.href = '/' + user + '/'; return;
					case 'exists': alert('Логин занят'); return;
					case 'error': alert(data.message); return;
				}
			}
		})

	}
	this.login = function(done)
	{
		var user = byId('loguser').value;
		var pass = byId('logpass').value;
		if(!user || !pass) return;
		//if(pass !== pass2) return;
		ajax.post('/auth/login', {
			data:{username: user, password: pass},
			cb: function(status, text)
			{
				var data = JSON.parse(text);
				switch(data.result)
				{
					case 'authorized': done(true); break;
					case 'error': alert(data.message); done(false); break;
					case false: alert('Неверный логин или пароль'); done(false); break;
				}
			}
		})

	}
	this.logout = function(done)
	{
		ajax.post('/auth/logout', {
			cb: function(status, text)
			{
				var data = JSON.parse(text);
				switch(data.result)
				{
					default:
					case 'unauthorized': done(true); break;
					case 'error': alert(data.message); done(false); break;
				}
			}
		})
	}

})();