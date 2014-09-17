'use strict';

function UI() {
	var ui;
	function Item(parent, name) {
		this._name = name || '';
		var growers = ui.growers;
		for(var x in growers) growers[x](this, parent);
	}
	ui = function(path, func) {
		var a = path.split('/');
		var i = ui;
		for(var x in a)
		{
			var t = i[a[x]];
			if(!t) i[a[x]] = t = new Item(i);
			i = t;
		}
		if(func) i._ex = func;
		return i;
	}
	function rename(item, name) {// Вызывается только методом load
		var rn = ui.renames;
		for(var y in rn) 
			rn[y](item, name);
		item._name = name;
	}
	function load(tree) {
        if(typeof tree === 'string') rename(this, tree);
		else for(var x in tree)
		{
			if(x === '_') {rename(this, tree[x]); continue;}
			if(!this[x]) this[x] = new Item(this);
			this[x].load(tree[x]);
        }
    }
    ui.load = load;
	ui.Item = Item;
	ui.renames = [];
	ui.growers = [];
	Item.prototype = {
		load: load
	}
	return ui;
}

var ui = UI();