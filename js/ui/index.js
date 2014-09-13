var ui = new (function UI()
{
	var ui = this;
	function UItem()
	{


	}
	this.add = function(path, func)
	{
		var a = path.split('/');
		var i = ui;
		for(var x in a)
		{
			var t = i[a[x]];
			if(!t) i[a[x]] = t = new UItem();
			i = t;
		}
		if(func) i.exec = func;
	};
	this.setTree = function(tree)
	{


	};


});