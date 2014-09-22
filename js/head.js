'use strict';

api.getUsers(function(error, data){
	var u = byId('users');
	if(!data.count) u.textContent = 'Нет пользователей';
	else
	{
		u.textContent = '';
		var users = data.items;
		for(var x in users)
		{
			var div = document.createElement('div');
			var a = document.createElement('a');
			a.textContent = users[x].name;
			a.href = '/' + users[x].name;
			div.appendChild(a);
			u.appendChild(div);
		}
	}
}, {limit:10});


api.getProjects(function(error, data){
	var u = byId('projects');
	if(!data.count) u.textContent = 'Нет проектов';
	else
	{
		var items = data.items;
		for(var x in items)
		{
			append('a', u).textContent = items[x].name;
		}
	}
}, {limit:10});

api.getNews(function(error, data){
	var u = byId('news');
	if(!data.count) u.textContent = 'Нет новостей';
	else
	{
		var items = data.items;
		for(var x in items)
		{
			append('a', u).textContent = items[x].name;
		}
	}
}, {limit:10});

function newProject()
{
	location.href = '/unknown_user/new_project';
}

function login()
{
	api.login(function(done) {
		if(!done) return;
		hide('login');
		show('logout');
		//label.textContent = 'Приветствую, ' + user.value;
	});
}

function logout()
{
	api.logout(function(done) {
		if(!done) return;
		hide('logout');
		show('login');		
	});

}