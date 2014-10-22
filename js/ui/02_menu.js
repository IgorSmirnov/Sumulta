'use strict';

function byId(id) { return document.getElementById(id);}

function append(tag, parent) {
    var r = document.createElement(tag);
    (parent || document.body).appendChild(r);
    return r;
}

function Menu(ui, body) {
    var menu = null, Item = ui.Item;
    ui.upds.push(function(i, name) {
        var li = i._li;
        if(!li) return;
        li.onclick = i._ex;
        li.onmouseenter = (!i._hv) ? undefined : function() {
            var d = i._hv();
            li.textContent = name;
            var ul = append('ul', li);
            for(var x in d)
            {
                var l = append('li', ul);
                l.textContent = d[x];
            } 
        };
        var cec = li.childElementCount;
        li.hidden = !(i._ex || i._hv || cec);
        if(typeof name !== 'string') return;
        if(name === "-") {li.className = "msep"; return;}
        if(cec) {
            for(var x = 0, t = []; x < cec; x++) t.push(li.children[x]);
            li.textContent = name;
            for(var x in t) li.appendChild(t[x]);
        } else {
            li.textContent = name;
        }
    });
	ui.growers.push(function(item, parent) {
		var pli = parent._li;
		if(!pli) return;
		var ul;
        if(pli.childElementCount) ul = pli.children[0];
        else {
            ul = append('ul', pli);
            pli.hidden = false;
        } 
		var li = append('li', ul);
		li.innerText = item._name;
		item._li = li;
	});
	
	function make(item, parent) {
		var li = item._li;
		if(!li)
		{
			li = append('li', parent);
			item._li = li;
		}
		if(item._name) li.innerText = item._name;
		li.onclick = item._ex;
		var ul = null;
		for(var x in item) if(item.hasOwnProperty(x) && x.charAt(0) !== '_')
		{
			if(!ul) ul = append('ul', li);
			make(item[x], ul);
		}
	}
    function makeMenu() {
        if(!menu)
        {
            menu = append('menu', body); 
            menu.className = 'hmenu';
        }
        if(arguments.length) for(var x in arguments)
        {
            var a = arguments[x];
            if(!this[a]) this[a] = new Item(this);
            make(this[a], menu);
        }
	else make(this, menu);
    }
    Item.prototype.makeMenu = makeMenu;
    ui.makeMenu = makeMenu;
}