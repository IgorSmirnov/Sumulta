"use strict";
// Рабочее пространство со всеми сохраняемыми данными

var storage = new (function()
{
    var data = {sheets: {"лист 1":[]}};
    this.data = data;
    this.active = data.sheets["лист 1"];
    this.ctors = {};
    this.getJSON = function()
    {
        workspace.sheets["лист 1"] = Items;
        return JSON.stringify(workspace, function(key, value)
        {
        	if(key !== "_" && key.charAt(0) === '_') return undefined;
        	if(typeof value === "object" && value.ctor)
        	{
       			var r = {_:value.ctor};
       			for(var x in value) if(value.hasOwnProperty(x) && typeof value[x] !== "function") 
       				r[x] = value[x];
       			var dep = value.dep;
       			for(var x in dep)
       			{
       				var p = dep[x];
       				if(r[p] instanceof Array)
       				{
       					var s = r[p], d = [];
       					for(var y in s) d[y] = Main.GetId(s[y]);
       					r[p] = d;
       				}
       				else r[p] = Main.GetId(r[p]);
       			}
        		return r;       		
        	}
        	return value;
        });
    }; 
})();

