"use strict";
// Работа с канвой, отрисовкой и масштабированием
function View(canvas, fast)
{
    this.scale = 1.0;
    this.offsetX = 0.0;
    this.offsetY = 0.0;

    this.canvas = fast ? fast : canvas;
    var ctx = canvas.getContext('2d'), fctx = fast.getContext('2d');
    var h = canvas.clientHeight, w = canvas.clientWidth;
    canvas.height = h;
    canvas.width = w;
    fast.height = h; 
    fast.width = w;
    var v = this;
    v.onresize = function(state)
    {
        var h = canvas.clientHeight, w = canvas.clientWidth;
        canvas.height = h;
        canvas.width = w;
        if(fast) {fast.height = h; fast.width = w;}
        ctx.setTransform(v.scale, 0, 0, v.scale, v.offsetX, v.offsetY);
        fctx.setTransform(v.scale, 0, 0, v.scale, v.offsetX, v.offsetY);
        v.needRedraw = true;
        v.needFast = true;
        v.commit(state);
    };
    var seq = [];
    v.needRedraw = true;
    v.insert = function(what, after, before)
    {
        if(after) for(var x in seq) if(seq[x] === after) { seq.splice(x + 1, 0, what); return;}
        if(before) for(var x in seq) if(seq[x] === before) { seq.splice(x, 0, what); return;}
        seq.push(what);
    }
    v.commit = function(state)
    {
        if(v.needFast) 
        {
            fctx.clearRect(-v.offsetX / v.scale, -v.offsetY / v.scale, canvas.width / v.scale, canvas.height / v.scale);
            view.needFast = false; if(state.draw) state.draw(fctx);
        }
        if(v.needRedraw) 
        {
            for(var x in seq) seq[x](ctx);
            v.needRedraw = false;
        }
    }
    
    v.clear = function clear(ctx)
    {
        ctx.clearRect(-v.offsetX / v.scale, -v.offsetY / v.scale, canvas.width / v.scale, canvas.height / v.scale);
    };
    v.draw = function(ctx)
    {
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        
        var items = storage.active;
        
        var md = true;
        var Selected = [];
        var touched = [];
        var err = [];
        for(var x in items)
        {
            var f = items[x];
            //if(f === mouseObject) {(f._sel ? Selected : touched).push(f); md = false; continue;}
            if(f._s & 2) {Selected.push(f); continue;}
            //if(selRect && f.RHit && f.RHit(left, top, right, bottom)) 
            if(f._s & 1) {touched.push(f); continue;}
            
            try {f.draw(ctx, 0);} 
            catch(e) {if(items[x]) err.push("#" + x + " " + items[x].constructor.name); items[x] = null;}
        }
        for(var x in Selected)
        {
            try {Selected[x].draw(ctx, 2);} 
            catch(e) {if(Selected[x]) err.push("#" + x + " " + Selected[x].constructor.name); /*Items[x] = null;*/}
        }
        for(var x in touched)
        {
            try {touched[x].draw(ctx, 1);} 
            catch(e) {if(touched[x]) err.push("#" + x + " " + touched[x].constructor.name); /*Items[x] = null;*/}
        }        
        //if(md && mouseObject) mouseObject.draw(ctx, 1);
        if(err.length > 0)
        {
            var y = 0;
            for(var x in items) if(items[x]) items[y++] = items[x];
            items.length = y;
            alert("Ошибка отрисовки объектов: \n" + err.join("\n"));
        }
    };
    v.insert(v.clear);
    v.insert(v.draw);
    v.transform = function()
    {
        ctx.setTransform(v.scale, 0, 0, v.scale, v.offsetX, v.offsetY);
        fctx.setTransform(v.scale, 0, 0, v.scale, v.offsetX, v.offsetY);
        v.needRedraw = true;
    };
}