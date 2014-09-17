"use strict";

function Menu(ui, doc) {
	var menu = null, Item = ui.Item;
	ui.renames.push(function(i, name) {
        var li = i._li;
        if(!li) return;
        var cec = li.childElementCount;
        if(cec)
        {
            for(var x = 0, t = []; x < cec; x++) t.push(li.children[x]);
            li.textContent = name;
            for(var x in t) li.appendChild(t[x]);
        } else li.textContent = name;
    });
	function createChild(tag, parent) {
		var r = doc.createElement(tag);
		parent.appendChild(r);
		return r;
	}
	ui.growers.push(function(item, parent) {
		var pli = parent._li;
		if(!pli) return;
		var ul = pli.children.length ? pli.children[0] : createChild('ul', pli);
		var li = createChild('li', ul);
		li.innerText = item._name;
		item._li = li;
	});
	
	function make(item, parent) {
		var li = item._li;
		if(!li)
		{
			li = createChild('li', parent);
			item._li = li;
		}
		if(item._name) li.innerText = item._name;
		li.onclick = item._ex;
		var ul = null;
		for(var x in item) if(item.hasOwnProperty(x) && x.charAt(0) !== '_')
		{
			if(!ul) ul = createChild('ul', li);
			make(item[x], ul);
		}
	}
	function makeMenu() {
        if(!menu)
        {
            menu = createChild('menu', doc.body); 
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

Menu(ui, document);

/*var Menu = (function()
{
    return function(name)
    {
        return function(doc, ui, parent, nm)
        {
            if(!menu) 
            {
                menu = doc.createElement('menu'); 
                menu.className = 'hmenu';
                doc.body.appendChild(menu);
            }
            if(!ui._menu) ui._menu = doc.createElement('li');
            if(parent._menu)
            {
                var m = parent._menu, ul;
                if(m.children.length) ul = m.children[0];
                else {ul = doc.createElement('ul'); m.appendChild(ul);}
                ul.appendChild(ui._menu);
            }
            else menu.appendChild(ui._menu);
            ui._menu.innerText = nm || name;
            if(ui.exec) ui._menu.onclick = ui.exec;
        }
    }
})();
/*var CMenu =
{
    Root:null,
    Add:function(o, r)
    {
        if(!r) r = this.Root;
        for(var i in o) if(o.hasOwnProperty(i) && i != "label" && i != "click")
        {
            var id = "menu" + i;
            var li = null;
            if(i.charAt(0) != "_")for(var t in r.children) 
                if(r.children[t].id == id) 
                    {
                        li = r.children[t];
                        break;
                    }
            if(!li)
            {
                li = document.createElement("li");
                if(o[i].label == "-") {li.className = "msep"; r.appendChild(li); continue;}
                li.innerHTML = o[i].label;
                if(i.charAt(0) != "_") li.id = id;
                li.onclick = o[i].click;
                r.appendChild(li);
            }
            var o2 = o[i];
            for(var g in o2) if(o2.hasOwnProperty(g) && g != "label" && g != "click")
            {
                var ul = li.getElementsByTagName('ul')[0];
                if(!ul)
                {
                    ul = document.createElement("ul");
                    li.appendChild(ul);
                }
                this.Add(o2, ul);
                break;
            }

        }


    }

};

CMenu.Root = document.getElementById("mainmenu");*/