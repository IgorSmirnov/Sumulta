"use strict";

function pd(o, d) {o._der ? o._der.push(d) : (o._der = [d]);}// Добавить к объекту o зависимый от него d

function rfa(a, v)
{
    var o = 0;
    for(var i = 0, e = a.length; i < e; i++)
    {
        var t = a[i];
        if(t !== v) a[o++] = t;
    }
    a.length = o;
}


function Storage()
{
    var storage = this;

    var data, getItem, getSheet;
    storage.data = 
    {
        sheets: 
        [{
          name: "Новый лист",
          items: []
        }],
        active: 0
    };
    data = storage.data;
    storage.active = data.sheets[0].items;
    storage.ctors = {};
    //this.name = 'Проект';
    storage.clear = function()
    {
        storage.data = {sheets:[], active:null};
        storage.active = null;
    };
    storage.getJSON = function()
    {
        var stack = [];
        function getId(o, sp)
        {
            var locId = "";
            if(o.locId) 
            {
                locId = "." + o.locId();
                o = o.o;
            }
            for(var p = sp; --p; )
            {
                var b = stack[p];
                for(var x in b) if(b[x] === o)
                {
                    var s = sp - p - 1;
                    if(!s && !locId) return x;
                    return "" + (s || "") + "." + x + locId;
                }
            }
            return "???" + locId;
        }
        function dig(data, sp)
        {
            var result = data instanceof Array ? [] : {};
            for(var key in data) if(data.hasOwnProperty(key))
            {
                if(key !== "_" && (key.charAt(0) === '_' || key.charAt(0) === '$')) continue;
                var value = data[key];
                if(typeof value === "function") continue;
                if(typeof value !== "object") {result[key] = value; continue;}
                if(value.toJSON) {result[key] = value.toJSON(function(o){return getId(o, sp)}); continue;}
                if(value.ctor)
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
                            for(var y in s) d[y] = getId(s[y], sp);
                            r[p] = d;
                        }
                        else r[p] = getId(r[p], sp);
                    }
                    result[key] = r;
                }
                else 
                {
                    stack[sp] = value;
                    result[key] = dig(value, sp + 1);
                }
            }
            return result;
        }
        
        return dig(storage.data, 0);
    },
    storage.putJSON = function(json) {
        storage.data = json;
        ////////// Пересоздаём /////
        function recreate(v, par)
        {
            function link(v, rn)
            {
                var r = null;
                if(typeof rn === "number") r = par[rn];
                else if(typeof rn === "string")
                {
                    var a = rn.split('.');
                    for(var x in a)
                    {
                        if(x == 0) r = par[a[x]];
                        else r = r.child(a[x]);
                        if(!r) throw "Unrecognized id '" + rn + "'";
                    }
                }
                if(r._der) r._der.push(v);
                else r._der = [v];
                return r;
            }
            if(typeof v === "object" && typeof v._ === "string")
            {
                var r = new storage.ctors[v._]; // Пересоздаём
                for(var x in v) if(x !== "_")
                {
                    var t = v[x];
                    if(typeof t === "object") t = recreate(t, v);
                    r[x] = t ? t : v[x];
                }
                
                
                if(r.dep) for(var x in r.dep) // Линкуем
                {
                    var d = r.dep[x];
                    if(r[d] instanceof Array) for(var y in r[d])
                        r[d][y] = link(r, r[d][y]);
                    else r[d] = link(r, r[d]);
                }
                
                if(r.onLoad) r.onLoad(); // Уведомляем
                return r;               
            }
            else
                for(var x in v) if(v[x] && typeof v[x] === "object") 
                {
                    var t = recreate(v[x], v); 
                    if(t) v[x] = t;
                }
            return null;
        }
        recreate(storage.data);
        
        /*function toObj(o, id)
        {
            var r = Main.ById(id);
            if(!r._der) r._der = [o];
            else r._der.push(o);
            return r;
        }
        for(var i in Items) if(Items[i]) try 
        {
            var r = Items[i];
            var dep = r.dep;
            if(dep) for(var x in dep)
            {
                var p = dep[x];
                if(r[p] instanceof Array) for(var y in r[p]) r[p][y] = toObj(r, r[p][y]);
                else r[p] = toObj(r, r[p]);
            }

            if(Items[i].OnLoad && !Items[i].OnLoad())
            {
                errors.push("Error in object " + i + " [class: '" + Items[i].constructor.name + "', data: '" + JSON.stringify(Items[i]) +"']: OnLoad() failed");
                Items[i] = undefined;
            }
        } 
        catch(e) 
        {
            errors.push("Error in object .OnLoad " + i + " [class: '" + Items[i].constructor.name + "']: "+ e.message);
            Items[i] = undefined; 
        }
        var r = 0;
        for(var i = 0, l = Items.length; i < l; i++) if(Items[i]) Items[r++] = Items[i];
        Items.length = r;*/
        storage.active = storage.data.sheets[storage.data.active].items;
    };
}

window.storage = new Storage();
