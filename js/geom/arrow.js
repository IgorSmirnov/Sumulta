"use strict";

function Arrow(a)
{
    this.ps = a;
    this._s = 0;
}

Arrow.prototype = 
{
    ctor: "Arrow", 
    dep: ["ps"],
    draw: function(ctx, type)
    {
        if(this.ps.length < 2) return;
        var color = this.color ? this.color : css.def;
        ctx.strokeStyle = (type & 2) ? css.sel :((type & 1) ? css.touch: color);
        ctx.beginPath();
        ctx.lineWidth = 2;
        var p = this.ps[0].pos();
        ctx.moveTo(p.x, p.y);
        var e = this.ps.length;
        for(var x = 1; x < e; x++)
        {
            p = this.ps[x].pos();
            ctx.lineTo(p.x, p.y);
        }
        p = this.ps[e - 1].pos();
        var X = p.x;
        var Y = p.y;
        p = this.ps[e - 2].pos();
        var dx = X - p.x;
        var dy = Y - p.y;
        var l = Math.sqrt(dx * dx + dy * dy) / 3;
        if(l > 0)
        {
            var xl = 3;
            dx /= l;
            dy /= l;
            ctx.moveTo(X - xl * dx - dy, Y - xl * dy + dx);
            ctx.lineTo(X, Y);
            ctx.lineTo(X - xl * dx + dy, Y - xl * dy - dx);
        }
        ctx.stroke();
        if(this.label)
        {
            var p = this.ps[0].pos();
            if(this.x) p.x += +this.x;
            if(this.y) p.y += +this.y;
            ctx.font = Main.font;
            ctx.textBaseline = "top";
            ctx.fillStyle = "#000000";
            ctx.fillText(this.label, p.x, p.y);
        }
    },
    moveBy: function(dx, dy)
    {
        if(!(this._s & 4))
        {
            for(var x in this.ps)
                this.ps[x].moveBy(dx, dy);
            this._s |= 4;
        }
    },
    hp:8,
    hit: function(x, y)
    {
        var pr = 3;
        var p1 = this.ps[0].pos();
        if(this.label)
        {
            var X = (this.x ? +this.x : 0) + p1.x;
            var Y = (this.y ? +this.y : 0) + p1.y;
            if(X < x && Y < y && Y + 10 > y)
            {
                ctx.font = Main.font;
                if(Y + ctx.measureText(this.label).width > y) return this._lp =
                {
                    o: this,
                    moveBy: function(dx, dy) {this.o.x += dx; this.o.y += dy;},
                    draw: function(t) 
                    {
                        var p = this.o.ps[0].pos();
                        if(typeof this.o.x  !== "number" || typeof this.o.y !== "number") {this.o.y = 0; this.o.x = 0;}
                        p.x += this.o.x;
                        p.y += this.o.y;
                        ctx.lineWidth = 0.5;
                        ctx.strokeRect(p.x, p.y + 1, ctx.measureText(this.o.label).width, 11);
                    }
                };
            }
        }
        for(var t = 0, e = this.ps.length - 1; t < e; t++)
        {
            var p = p1;
            var p1 = this.ps[t + 1].pos();
            if(x - pr > p.x && x - pr > p1.x) continue;
            if(y - pr > p.y && y - pr > p1.y) continue;
            if(x + pr < p.x && x + pr < p1.x) continue;
            if(y + pr < p.y && y + pr < p1.y) continue;
            var dx = p1.x - p.x, dy = p1.y - p.y;
            var m = (dx) * (y - p.y) - (dy) * (x - p.x);
            var l = Math.sqrt(dx * dx + dy * dy);
            m /= l;
            if(Math.abs(m) < pr) return this;
        }
        return null;
    },
    rHit: function(l, t, r, b) {
        for(var x in this.ps) {
            var p = this.ps[x].pos();
            if(p.x < l || p.y < t || p.x > r || p.y > b) return false;
        }
        return true;
    },
    GetPSel: function() 
    {
        if(this._s & 2) return true;
        for(var t = 0, e = this.ps.length; t < e;t++)
            if(this.ps[t]._s & 2) return true;
        return  false;
    },
    onDblClick: function()
    {
        if(Dialogs) Dialogs.Create(
        {
            title:"Свойства",
            update:Main.Redraw,
            data:
            {
                label:"Метка",
                x:"Метка, X",
                y:"Метка, Y"
            }
        }, this);        
    }
		
};

(function(storage, ctl, editor, view)
{
    var pt = null, obj = null, Pt = Point, Arr = Arrow;
    storage.ctors["Arrow"] = Arr;
    var onFreeMove = ctl.states.free.move;

    var nx =
    {
        draw: function(ctx) {obj.draw(ctx, 1);},
        move: function(x, y)
        {
            onFreeMove(x, y);
            var mo = editor.mo;
            if(mo && mo.pos)
            {
                var p = mo.pos();
                pt.x = p.x;
                pt.y = p.y;
            }
            else
            {
                pt.x = x; 
                pt.y = y;
            }
            return true;
        },
        leftup: function(x, y)
        {
            var point, mo = editor.mo;        
            if(editor.pointAlign && mo && mo.pos)
            {
                var ps = obj.ps;
                ps[ps.length - 1] = mo;
            }
            else
            {
                storage.active.push(pt);
                pt = new Pt(x, y);
            }
            obj.ps.push(pt);
        },
        rightup: function(x, y)
        {
            var items = storage.active;            
            obj.ps.pop();
            if(obj.ps.length > 1) items.push(obj);
            else items.pop();
            obj = null;
            pt = null;
            ctl.pop();
            view.needRedraw = true;
            return true;
        }
    };
    var pre =
    {
        move: onFreeMove, //function(x, y) {if(Main.PointAlign) Main.OnAlignedMove(x, y); else Main.OnFreeMove(x, y);},
        leftup: function(x, y)
        {
            var point, mo = editor.mo;
            if(editor.pointAlign && mo && mo.pos) point = mo; // Выбираем первую точку
            else storage.active.push(point = new Pt(x, y)); // или создаём
            pt = new Pt(x, y); // Создаём вторую точку
            obj = new Arr([point, pt]); // Создаём линию
            ctl.go(nx);
        },
        rightup: ctl.pop
    };
    function onCreate() 
    { 
    	ctl.call(pre);
    	//if(typeof CToolbar !== "undefined") CToolbar.cancel.show(true);
    }
    ui('create/arrow', onCreate);
})(storage, ctl, editor, view);