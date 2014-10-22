'use strict';


function refreshLog() {
	var tab = document.getElementById('log');
	ajax.get('/admin/log.json', {cb:function(status, text) {
		var data = JSON.parse(text);
		tab.innerHTML = '<caption>Log(' + data.count + ')</caption>';
		var items = data.items;
		for(var x in items)
		{
			var item = items[x];
			var tr = document.createElement('tr');

			var time = document.createElement('td');
			time.textContent = item.timestamp;
			tr.appendChild(time);

			var level = document.createElement('td');
			tr.className = level.textContent = item.level;
			tr.appendChild(level);

			var message = document.createElement('td');
			message.textContent = item.message;
			tr.appendChild(message);

			tab.appendChild(tr);
		}

	}});


}