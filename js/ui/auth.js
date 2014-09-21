'use strict';

var auth = new (function() {
	var dlg = document.getElementById('login');
	var user = document.getElementById('loguser');
	var pass = document.getElementById('logpass');
	var label = document.getElementById('user');
	var benter = document.getElementById('benter');
	var a = false;
	this.login = function() {
		var labels = ui('auth');
		if(dlg.hidden) dlg.hidden = false;
		else if(!(user.value && pass.value)) dlg.hidden = true;
		else api.login(function(done) {
			if(!done) return;
			label.hidden = false;
			label.textContent = 'Приветствую, ' + user.value;
			dlg.hidden = true;
			benter.textContent = labels.logout._name;
			benter.onclick = auth.logout;
			a = true;
		});
	};
	this.logout = function() {
		if(a) api.logout(function(done) {
			if(!done) return;
			label.hidden = true;
			benter.onclick = auth.login;
			benter.textContent = ui('auth/login')._name;
			a = false;
		});

	}
})();