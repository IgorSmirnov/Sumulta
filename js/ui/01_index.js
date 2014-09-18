'use strict';

function createChild(tag, parent) {
    var r = document.createElement(tag);
    (parent || document.body).appendChild(r);
    return r;
}

function UI() {
    var ui;
    function Item(parent, name) {
        this._name = name || '';
        var growers = ui.growers;
        for(var x in growers) growers[x](this, parent);
    }
    function update(item, name) {
        if(typeof name === 'string') item._name = name;
        var up = ui.upds;
        for(var y in up) 
            up[y](item, name);
    }    
    ui = function(path, func) {
        var a = path.split('/');
        var i = ui;
        for(var x in a)
        {
            var t = i[a[x]];
            if(!t) i[a[x]] = t = new Item(i);
            i = t;
	}
        if(func) i._ex = func;
        update(i);
        return i;
    }
    function load(tree) {
        if(typeof tree === 'string') update(this, tree);
        else for(var x in tree)
        {
            if(x === '_') {update(this, tree[x]); continue;}
            if(!this[x]) this[x] = new Item(this);
            this[x].load(tree[x]);
        }
    }
    ui.load = load;
    ui.Item = Item;
    ui.growers = [];
    ui.upds = [];
    Item.prototype = {
        load: load,
        hover: function(cb)
        {
            this._hv = cb;
            update(this);
        }
    };
    return ui;
}

var ui = UI();