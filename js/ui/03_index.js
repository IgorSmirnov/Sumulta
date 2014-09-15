'use strict';

function UI(doc)
{
	var ui = this;
	function UItem()
	{
	}
	function add(path, func)
	{
        	var a = path.split('/');
		var i = this;
		for(var x in a)
		{
			var t = i[a[x]];
			if(!t) i[a[x]] = t = new UItem();
			i = t;
		}
		if(func) i.exec = func;
                return i;
	}
        function setTree(tree, parent, ctor)
        {
		if(!tree) return;
                if(typeof tree === 'string')
                {
                    if(ctor) ctor(doc, this, parent, tree);
                    return;
                }
		if(typeof tree === 'object') for(var x in tree)
		{
			if(x === '_')
                        {
				if(typeof tree[x] === 'function') ctor = tree[x];
                                if(ctor) ctor(doc, this, parent, (typeof tree[x] === 'string') ? tree[x] : null);
				continue;
                        }
			if(!this[x]) this[x] = new UItem();
			this[x].setTree(tree[x], this, ctor);
                }
        
        }
        ui.add = add;
        ui.setTree = setTree;
        UItem.prototype =
        {
            add: add,
            setTree:setTree
        };
	ui.setTree = setTree;
}

var ui = new UI(document);
