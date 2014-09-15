var ui = new (function UI()
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
	};
        ui.add = add;
        UItem.prototype =
        {
            add: add
        };
	ui.setTree = function(tree)
	{


	};


});