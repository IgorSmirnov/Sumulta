this.pd = (o, d) ->
  o._der ? o._der.push d : (o._der = [d])

this.rfa = (a, v) ->
    o = 0
    for t in a
        a[o++] = t if t isnt v
    a.length = o

Storage = ->
    data = 
        sheets: [{name:"Новый лист", items:[]}]
    this.data = data
    this.active = data.sheets[0].items
    data.active = 0;
    this.ctors = {}
    this.name = 'Проект'
    getItem  = (item, items) ->
        if item.toJSON?
            return item.toJSON (o) ->
                return o.getId() if o.getId? 
                items.indexOf(o);
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
    this.putJSON = (json) ->
        this.data = data = JSON.parse json
        data.active = 0 if !data.active?
        this.active = data.sheets[data.active].items
        ctors = this.ctors
        for sheet in data.sheets
            for item in sheet.items
                r = new ctors[item._]
                for x, prop in item
                    r[x] = prop if x isnt '_'
                for d in r.dep if r.dep?
                    
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

