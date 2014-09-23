'use strict';

var u = byId('users');
if(u) api.getUsers(function(error, data){
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

var p = byId('projects');
if(p) api.getProjects(function(error, data){
	if(!data.count) p.textContent = 'Нет проектов';
	else
	{
		var items = data.items;
		for(var x in items)
		{
			append('a', p).textContent = items[x].name;
		}
	}
}, {limit:10});

var n = byId('news');
api.getNews(function(error, data){
	if(!data.count) n.textContent = 'Нет новостей';
	else
	{
		var items = data.items;
		for(var x in items)
		{
			append('a', n).textContent = items[x].name;
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