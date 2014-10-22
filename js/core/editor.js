"use strict";

function Editor(storage, view, ctl)
{
    this.mo = null;
    this.pointAlign = true;
    var selRect = null;
    var ed = this;
    var adm = 3;
    
    ed.draw = function(ctx)
    {
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        
        var items = storage.active;
        
        var md = true;
        var selected = [];
        var touched = [];
        var err = [];
        var mo = ed.mo;
        for(var x in items)
        {
            var f = items[x];
            if(f === mo) {((f._s & 2) ? selected : touched).push(f); md = false; continue;}
            if(f._s & 2) {selected.push(f); continue;}
            //if(selRect && f.RHit && f.RHit(left, top, right, bottom)) 
            if(f._s & 1) {touched.push(f); continue;}
            
            try {f.draw(ctx, 0);} 
            catch(e) {if(items[x]) err.push("#" + x + " " + items[x].constructor.name); items[x] = null;}
        }
        for(var x in selected)
        {
            try {selected[x].draw(ctx, 2);} 
            catch(e) {if(selected[x]) err.push("#" + x + " " + selected[x].constructor.name); /*Items[x] = null;*/}
        }
        for(var x in touched)
        {
            try {touched[x].draw(ctx, 1);} 
            catch(e) {if(touched[x]) err.push("#" + x + " " + touched[x].constructor.name); /*Items[x] = null;*/}
        }        
        if(md && mo) mo.draw(ctx, 1);
        if(err.length > 0)
        {
            var y = 0;
            for(var x in items) if(items[x]) items[y++] = items[x];
            items.length = y;
            alert("Ошибка отрисовки объектов: \n" + err.join("\n"));
        }
    };
    function onFreeMove(mx, my) // Свободное движение мыши
    {
        var items = storage.active;
        var mo = null, hp = 0, a = adm / view.scale
        for(var x = items.length; x--;)
        {
            if(hp && (!items[x].hp || items[x].hp < hp)) continue;
            var t = items[x].hit(mx, my, a);
            if(t) {mo = t; hp = t.hp;}
        }
        if(ed.mo != mo) 
        {
            if(ed.mo) ed.mo._s &= ~1;
            ed.mo = mo;
            view.needRedraw = true;
            if(mo) mo._s |= 1;
            return true;
        }
    }
    var MX, MY;
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
        this.stroke = function(ctx) {ctx.strokeStyle = "#8080FF"; ctx.strokeRect(this.x, this.y, this.w, this.h);};
    }
    var objmove = // Перемещение мышью выделенных объектов 
    {
        move: function(mx, my)
        {
            var items = storage.active;
            var dx = mx - MX;
            var dy = my - MY;
            MX = mx;
            MY = my;
            var mo = ed.mo;
            for(var x in items) if((items[x]._s & 2) && items[x].moveBy) items[x].moveBy(dx, dy);
            if(mo && mo.moveBy)
                mo.moveBy(dx, dy);
            for(var x in items) items[x]._s &= 3;
            if(mo) mo._s &= 3;
            return view.needRedraw = true;
        },
        leftup: ctl.pop    
    };
    var modown = // Мышь наведена на объект и нажата левая кнопка
    {
        move: function(mx, my)
        {
            if(!(ed.mo._s & 2))
            {
                var items = storage.active;
                for(var x in items) items[x]._s &= ~2; // Сбрасываем выделение
                ed.mo._s |= 2; // Выделяем объект
            }
            ctl.go(objmove);
            return objmove.move(mx, my);
        }, 
        leftup: function(mx, my)
        {
            ctl.pop();
            var mo = ed.mo;
            (mo._s & 2) ? (mo._s &= ~2) : (mo._s |= 2);
            view.needRedraw = true;
            return true;
        }
    };
    var selmove = // Перемещение рамки выделения
    {
        move: function(x, y) 
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
            return true;
        }, 
        leftup: function()           
        {
            var items = storage.active;
            for(var x in items)
            {
                var s = items[x]._s;
                if(s & 1)
                {
                    if(items[x].onSel && !(s & 2)) items[x].onSel(true);
                    s |= 2; s &= ~1;
                    items[x]._s = s;
                }
            }
            ctl.pop();
            view.needRedraw = true;
            return true;
        },
        draw: function(ctx) {selRect.stroke(ctx);}
    };
    var seldown = // Мышь наведена на пустое место и нажата левая кнопка
    {
        move: function(x, y)
        {
            if(x === selRect.x && y === selRect.y) return false; // во избежание излишних move
            ctl.go(selmove);
            return selmove.move(x, y)
        },
        leftup: function(mx, my)
        {
            var items = storage.active;
            for(var x in items) if(items[x]._s & 2)
            {
                if(items[x].onSel) items[x].onSel(0);
                items[x]._s = 0;
                view.needRedraw = true;
            }
            ctl.pop();
            return true;
        }
    };

    var states = 
    { // Состояния
        free: // Свободное состояние
        {
            //draw: function(ctx) {var mo = ed.mo; if(mo) mo.draw(ctx, mo._s & 3);},
            move: onFreeMove,
            leftdown: function(x, y) 
            {
                if(ed.mo)
                {
                    MX = x; MY = y;
                    ctl.call(modown);
                }
                else 
                {
                    selRect = new SimpleRect(x, y, 0, 0); 
                    ctl.call(seldown);
                }
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
            _leave:function() {CToolbar.select.check(false);}
        },
        onlymove:
        {
            _enter:function() {CToolbar.move.check(true);},
            leftdown: function(x, y) {Main.MX = x; Main.MY = y; selRect = new SimpleRect(Main.MX, Main.MY, 0, 0);ctl.call(states.objonlymove);},
            onlymove: ctl.pop,
            select:function() {ctl.go(states.select);},
            _leave: function() {CToolbar.move.check(false);}
        }
    };
    ctl.states = states;
    ctl.go(states.free);
    view.needRedraw = true;
    view.commit(states.free);
    
    
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


