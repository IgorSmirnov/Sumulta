"use strict";
var Items = [];
var MouseObject = null;
var SelRect = null;
var ctx = null;
var canvas = null;

function RemoveFromArray(a, v)
{
    var o = 0;
    for(var i = 0, e = a.length; i < e; i++)
    {
        var t = a[i];
        if(t !== v) a[o++] = t;
    }
    a.length = o;
}

function PushDer(o, d) // Добавить к объекту o зависимый от него d
{
    if(o._der) o._der.push(d);
    else o._der = [d];
}

var Main = {
    adm:3, // Допуск при выборе
    NeedRedraw: false,
    PointAlign:true,
    MX: 0, MY: 0,
    Modules:[],
    Ctors:{},
    Color: "#000",
    Back: "#FFF",
    font: '10px monospace',
    hitPriority: 100,
    onLoads:[],
    onLoad: function()
    {
    	for(var x in onLoads) onLoads[x]();    	
    },
    OnCSS: function(f)
    {
    	switch(f)
    	{
    	case "lite.css":
    	default:
    		if(Grid) Grid.Style = "#808080";
            Main.Color = "#000";
    		Main.Back = "#FFF";
    		break;
    	case "matrix.css":
    		if(Grid) Grid.Style = "#2A8106";
            Main.Color = "#76E215";
    		Main.Back = "#FFF";
    		break;
    	}
        Main.Redraw();
    },

    DeleteAll: function()
    {
        Items.length = 0;
        Main.Redraw();
    },
    Delete: function()
    {
        var x, y, e;
        for(x = 0, y = 0, e = Items.length; x < e; x++)
        {
            var i = Items[x];
            if((i.GetPSel && !i.GetPSel()) || !i._sel) Items[y++] = i;
            else
            {
                if(i.del) i.del();
                i.deleted = true;
            }
        }
        Items.length = y;
        Main.Redraw();
    },


    GetId: function(o)
    {
        if(o.GetId) return o.GetId();
        return Items.indexOf(o);
    },
    ById: function(id)
    {
        if(typeof id === "object") return id;
        if(typeof id === "number") return Items[id];
        var a = id.split('.');
        var r = null;
        for(var x in a)
        {
            if(x == 0) r = Items[a[x]];
            else r = r.child(a[x]);
            if(!r) throw "Unrecognized id '" + id + "'";
        }
        return r;
    },

    onProps: function()
    {
        for(var x in Items) if(Items[x]._sel && Items[x].onDblClick) { Items[x].onDblClick(); break;}
    },
    Init: function()
    {
        State = States.free;
        Main.OnMouseMove = Main.OnFreeMove;
        

        if(window.CMenu)
        {
            CMenu.Add({
                file:{_: {label: "Новый", click: Main.DeleteAll}}, 
                edit:{
                    _: {label: "Удалить", click: Main.Delete},
                    _1:{label: "Свойства", click: Main.onProps}
                }
            });
        }
        for(var x in Main.Modules)
            if(Main.Modules[x].OnInit) Main.Modules[x].OnInit(canvas, ctx);
        Main.Redraw();
    }
};