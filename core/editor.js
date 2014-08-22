"use strict";

function Editor(storage, view, ctl)
{
    this.mo = null;
    this.pointAlign = true;
    var items = storage.active;
    var selRect = null;
    var ed = this;
    var adm = 3;
    function onFreeMove(mx, my) // Свободное движение мыши
    {
        var mo = null;
        var hp = 0; // Hit priority
        var a = adm / view.scale
        for(var x = items.length; x--;)
        {
            if(!items[x].hp || items[x].hp < hp) continue;
            var t = items[x].hit(mx, my, a);
            if(t) {mo = t; hp = t.hp;}
        }
        if(ed.mo != mo) 
        {
            if(ed.mo) ed.mo._s &= ~1;
            ed.mo = mo; view.needRedraw = true;
            if(mo) mo._s |= 1;
        }
    }
    ed.align = function(pos)
    {
    
    };
    /*function onObjOnlyMove(mx, my) // Движение с привязкой к объектам
    {
        var mo = null;
        hitPriority = 100;
        for(var x = items.length; x--;)
        {
            var t = items[x].hit(mx, my);
            if(t) mo = t;
        }
        if(Main.EveryRedraw || ed.mo != mo) {ed.mo = mo; view.needRedraw = true;}
    }*/
    function onLeftUp(mx, my)
    {
        if(selRect)
        {
            if(selRect.w == 0 && selRect.h == 0)
            {
                var mo = ed.mo;
                if(mo)
                {
                    var s = mo._s;
                    (s & 2) ? s &= ~2 : s |= 2;
                    if(mo.onSel) mo.onSel(s);
                    mo._s = s;
                }
                else for(var x in items) if(items[x]._s & 2)
                {
                    if(items[x].onSel) items[x].onSel(0);
                    items[x]._s = 0;
                }
            } 
            else
            {
                var left = selRect.left();
                var top = selRect.top();
                var right = selRect.right();
                var bottom = selRect.bottom();

                for(var x in items)
                {
                    var s = items[x]._s;
                    if(s & 1)//if(items[x].rHit && items[x].rHit(left, top, right, bottom))
                    {
                        if(items[x].onSel && !(s & 2)) items[x].onSel(true);
                        s |= 2; s &= ~1;
                        items[x]._s = s;
                    }
                }
            }
        }

        selRect = null;
        ctl.pop();
        view.needFast = true;
        view.needRedraw = true;
    }
    var MX, MY;
    function onObjOnlyMove(mx, my) // Перемещение объектов с левой кнопкой
    {
        var dx = mx - MX;
        var dy = my - MY;
        MX = mx;
        MY = my;
        var mo = ed.mo;
        for(var x in items) if((items[x]._s & 2) && items[x].moveBy) items[x].moveBy(dx, dy);
        if(mo && !(mo._s & 2) && mo.moveBy)
            mo.moveBy(dx, dy);
        for(var x in items) items[x]._s &= 3;
        if(mo) mo._s &= 3;
        view.needRedraw = true;
    }
    function onObjMove(mx, my)
    {
        if(!(ed.mo._s & 2))
        {
            for(var x in items) items[x]._s &= ~2;
            ed.mo._s |= 2;
        }
    	onObjOnlyMove(mx, my);
    }
    function onSelMove(x, y) // Перемещение рамки выделения
    {
        selRect.w = x - selRect.x;
        selRect.h = y - selRect.y;
        var left = selRect.left(), top = selRect.top(), right = selRect.right(), bottom = selRect.bottom();
        var items = storage.active;
        for(var t in items)
        {
            var i = items[t];
            if(i.rHit)
            {
                var h = i.rHit(left, top, right, bottom);
                if(h === !(i._s & 1))
                {
                    view.needRedraw = true;
                    h ? i._s |= 1 : i._s &= ~1;
                }
            }
        }
        view.needFast = true;
    }
    function SimpleRect(x, y, w, h)
    {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.left = function() {return this.w > 0 ? this.x : this.x + this.w;};
        this.top = function() {return this.h > 0 ? this.y : this.y + this.h;};
        this.right = function() {return this.w < 0 ? this.x : this.x + this.w;};
        this.bottom = function() {return this.h < 0 ? this.y : this.y + this.h;};
        this.stroke = function(ctx) {ctx.strokeRect(this.x, this.y, this.w, this.h);};
    }
    function draw(ctx)
    {
        if(selRect)
        {
            ctx.strokeStyle = "#8080FF";
            selRect.stroke(ctx);
        }    
    }
    var states = 
    { // Состояния
        free:
        {
            draw: draw,
            move: onFreeMove,
            leftdown: function(x, y) 
            {/*Main.MX = x; Main.MY = y;*/ 
                selRect = new SimpleRect(x, y, 0, 0); 
                if(ed.mo)
                {
                    MX = x; MY = y;
                    ctl.call(states.objmove);
                }
                else ctl.call(states.selmove);
            },
            dblclick:function(x, y) {var mo = ed.mo; if(mo && mo.onDblClick) mo.onDblClick(x, y);},
            select:function() {ctl.call(states.select);},
            onlymove:function() {ctl.call(states.onlymove);}
        },
        select:
        {
            _enter:function() {CToolbar.select.check(true);},
            leftdown: function(x, y) {/*Main.MX = x; Main.MY = y; */selRect = new SimpleRect(x, y, 0, 0);ctl.call(states.selmove);},
            select: ctl.pop,
            onlymove:function() {ctl.go(states.onlymove);},        
            _leave:function() {CToolbar.select.check(false);},
        },
        onlymove:
        {
            _enter:function() {CToolbar.move.check(true);},
            leftdown: function(x, y) {Main.MX = x; Main.MY = y; selRect = new SimpleRect(Main.MX, Main.MY, 0, 0);ctl.call(states.objonlymove);},
            onlymove: ctl.pop,
            select:function() {ctl.go(states.select);},
            _leave: function() {CToolbar.move.check(false);}
        },
        selmove:{move:onSelMove, leftup: onLeftUp},
        objmove:{move: onObjMove, leftup: onLeftUp},
        objonlymove:{move: onObjOnlyMove, leftup:ctl.pop}
    };
    ctl.states = states;
    ctl.go(states.free);
    
    function deleteAll()
    {
        items.length = 0;
        view.needRedraw = true;
        view.commit();
    }
    function deleteSel()
    {
        var x, y, e;
        for(x = 0, y = 0, e = items.length; x < e; x++)
        {
            var i = items[x];
            if((i.getPSel && !i.getPSel()) || !(i._s & 2)) items[y++] = i;
            else
            {
                if(i.del) i.del();
                i.deleted = true;
            }
        }
        items.length = y;
        view.needRedraw = true;
        view.commit();
    }
}

var view = new View(document.getElementById("canvas"), document.getElementById("fast"));
var ctl = new Controller(view);
var editor = new Editor(storage, view, ctl);





