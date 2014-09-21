'use strict';

api.getUsers(function(error, data){
	var u = document.getElementById('users');
	if(!data.count) u.innerText = 'Нет пользователей';
	else
	{
		u.innerText = '';
		var users = data.items;
		for(var x in users)
		{
			var div = document.createElement('div');
			var a = document.createElement('a');
			a.innerText = users[x].name;
			a.href = '/' + users[x].name;
			div.appendChild(a);
			u.appendChild(div);
		}
	}
}, {limit:10});


api.getProjects(function(error, data){
	var u = document.getElementById('projects');
	if(!data.count) u.innerText = 'Нет проектов';
	else
	{
		var projects = data.projects;
		for(var x in projects)
		{
			var a = document.createElement('a');
			a.innerText = user[x].name;
			u.appendChild(a);
		}
	}
}, {limit:10});

api.getNews(function(error, data){
	var u = document.getElementById('news');
	if(!data.count) u.innerText = 'Нет новостей';
	else
	{
		var projects = data.projects;
		for(var x in projects)
		{
			var a = document.createElement('a');
			a.innerText = user[x].name;
			u.appendChild(a);
		}
	}
}, {limit:10});

function show(id) {
	document.getElementById(id).hidden = false;
}

function hide(id) {
	document.getElementById(id).hidden = true;
}

function newProject()
{
	location.href = '/unknown_user/new_project';
}