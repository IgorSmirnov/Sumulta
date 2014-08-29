"use strict";
// Работа с канвой, отрисовкой и масштабированием
function View(canvas, fast)
{
    var v = this;
    v.scale = 1.0;
    v.offsetX = 0.0;
    v.offsetY = 0.0;

    v.canvas = fast ? fast : canvas;
    var ctx = canvas.getContext('2d'), fctx = fast.getContext('2d');
    v.onresize = function(state)
    {
        var h = canvas.clientHeight, w = canvas.clientWidth;
        canvas.height = h;
        canvas.width = w;
        if(fast) {fast.height = h; fast.width = w;}
        ctx.setTransform(v.scale, 0, 0, v.scale, v.offsetX, v.offsetY);
        fctx.setTransform(v.scale, 0, 0, v.scale, v.offsetX, v.offsetY);
        v.needRedraw = true;
        v.commit(state);
    };
    v.seq = [];
    v.needRedraw = true;
    /*v.insert = function(what, after, before)
    {
        if(after) for(var x in seq) if(seq[x] === after) { seq.splice(x + 1, 0, what); return;}
        if(before) for(var x in seq) if(seq[x] === before) { seq.splice(x, 0, what); return;}
        seq.push(what);
    }*/
    var needClear = false;
    v.commit = function(state)
    {
        if(needClear) fctx.clearRect(-v.offsetX / v.scale, -v.offsetY / v.scale, canvas.width / v.scale, canvas.height / v.scale);
        if(state.draw) 
        {
            state.draw(fctx);
            needClear = true;
        }
        if(v.needRedraw) 
        {
            var seq = v.seq;
            for(var x in seq) seq[x](ctx);
            v.needRedraw = false;
        }
    }
    
    v.clear = function clear(ctx)
    {
        ctx.clearRect(-v.offsetX / v.scale, -v.offsetY / v.scale, canvas.width / v.scale, canvas.height / v.scale);
    };
    v.transform = function()
    {
        ctx.setTransform(v.scale, 0, 0, v.scale, v.offsetX, v.offsetY);
        fctx.setTransform(v.scale, 0, 0, v.scale, v.offsetX, v.offsetY);
        v.needRedraw = true;
    };
}
