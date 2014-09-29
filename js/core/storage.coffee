Storage = ->
    data = 
        sheets: [{name:"Новый лист", items:[]}]
    this.data = data
    this.active = data.sheets[0].items
    this.ctors = {}
    this.name = 'Проект'
    getItem  = (item, items) ->
        return item.toJSON() if item.toJSON?
        result = _: item.ctor
        result[name] = field for own name, field of item
        if item.dep?
            for dep in item.dep 
                result[dep] =
                    if item.getId?
                        item.getId items
                    else items.indexOf item
        result
    getSheet = (sheet) ->
        result = {}
        for name, field of sheet
            result[name] =
                if name is 'items'
                    getItem item, field for item in field
                else field
        result
    this.getJSON = ->
        result = {}
        for own name, block of data
            result[name] =
                if name is 'sheets'
                    getSheet sheet for sheet in block
                else block
        JSON.stringify result, (key, value) ->
            return value if key is '_'
            c = key[0]
            if c is '_' or c is '$'
                undefined
            else value
    this
###
        return JSON.stringify(data, function(key, value)
        {
        	if((key !== "_" && key[0] === '_') || key[0] === '$') return undefined;
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
       					for(var y in s) d[y] = getId(s[y]);
       					r[p] = d;
       				}
       				else r[p] = getId(r[p]);
       			}
        		return r;       		
        	}
        	return value;
        });
    }; 
###
window.storage = new Storage()

