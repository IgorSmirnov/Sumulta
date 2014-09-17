"use strict";

function Point(x, y)
{
    this.x = x;
    this.y = y;
    this._der = [];
    this._s = 0;
}

Point.prototype = 
{
    toJSON:function(){return {_:"Point", x:this.x, y:this.y};},
    pos: function() {return {x:this.x, y:this.y};},
    draw: function(ctx, Type)
    {
        ctx.strokeStyle = this._sel ? "#FF0000" : css.color;
        if(Type > 0 || this._sel || !this._der.length)
        {
            ctx.lineWidth = 1;
            ctx.strokeRect(this.x - 2, this.y - 2, 4, 4);
        } //else ctx.strokeRect(this.x - 1, this.y - 1, 3, 3);
    },
    moveBy: function(dx, dy)
    {
        if(!(this._s & 4))
        {
            this.x += dx;
            this.y += dy;
            this._s |= 4;
            if(this.Owner) this.Owner.OnPtMoveBy(this, dx, dy);
        }
    },
    hp: 10, // Hit priority
    hit: function(x, y, adm)
    {
        var dx = Math.abs(this.x - x);
        var dy = Math.abs(this.y - y);
        if(dx < adm && dy < adm) return this;
        else return null;
    },
    rHit: function(l, t, r, b) {return l < this.x && t < this.y && r > this.x && b > this.y;},
    OnDblClick: function()
    {
        if(Dialogs) Dialogs.Create(
        {
            title:"Свойства",
            update:Main.Redraw,
            data:
            {
                x:"X",
                y:"Y"
            }
        }, this);
    },
    GetPSel: function() {return this._sel;}
};

function Line(p1, p2)
{
    this.p1 = p1;
    this.p2 = p2;
    if(typeof p1 === "object" ) pd(p1, this);
    if(typeof p2 === "object" ) pd(p2, this);
    this._s = 0;
}


Line.prototype = 
{
    ctor: "Line",
    dep:["p1", "p2"],
    draw: function(ctx, type)
    {
        var color = this.color ? this.color : css.def;
        ctx.strokeStyle = (type & 2) ? css.sel :((type & 1) ? css.touch: color);
        ctx.lineWidth = this.width ? this.width : 0.5;
        ctx.beginPath();
        var p = this.p1.pos();
        ctx.moveTo(p.x, p.y);
        p = this.p2.pos();
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
    },
    moveBy: function(dx, dy)
    {
        if(!(this._s & 4))
        {
            this.p1.moveBy(dx, dy);
            this.p2.moveBy(dx, dy);
            this._s |= 4;
        }
    },
    hp:8,
    hit: function(x, y, adm)
    {
        var p1 = this.p1.pos();
        var p2 = this.p2.pos();
        var xx = x - adm;
        var yy = y - adm;
        if(xx > p1.x && xx > p2.x) return null;
        if(yy > p1.y && yy > p2.y) return null;
        xx = x + adm;
        yy = y + adm;
        if(xx < p1.x && xx < p2.x) return null;
        if(yy < p1.y && yy < p2.y) return null;
        var dx = p2.x - p1.x, dy = p2.y - p1.y;
        var m = (dx) * (y - p1.y) - (dy) * (x - p1.x);
        var l = Math.sqrt(dx * dx + dy * dy);
        m /= l;
        if(Math.abs(m) < adm) return this;
        return  null;
    },
    rHit: function(l, t, r, b)
    {
        var p1 = this.p1.pos();
        var p2 = this.p2.pos();
        return (p1.x > l && p1.y > t && p1.x < r && p1.y < b) && (p2.x > l && p2.y > t && p2.x < r && p2.y < b);
    },
    setP2: function(P)
    {
        RemoveFromArray(this.p2._der, this);
        this.p2 = P;
        PushDer(P, this);
    },
    setP1: function(P)
    {
        RemoveFromArray(this.p1._der, this);
        this.p1 = P;
        PushDer(P, this);
    },   
    del: function()
    {
        RemoveFromArray(this.p1._der, this);
        RemoveFromArray(this.p2._der, this);
    },
    vec: function(p)
    {
        var a = this.p1.pos();
        var b = this.p2.pos();
        var x = b.x - a.x;
        var y = b.y - a.y;
        var l = Math.sqrt(x * x + y * y);
        if(l > 0.000000001) {x /= l; y /= l;}
        if(p === this.p1) return {x: x, y: y};
        if(p === this.p2) return {x: -x, y: -y};
    },
    GetPSel: function() {return this._sel || this.p1._sel || this.p2._sel;}
};

(function(storage, ctl, editor, view)
{
    var pt = null, obj = null, ctor = Line, Pt = Point;
    storage.ctors["Point"] = Pt;
    storage.ctors["Line"] = ctor;
    var items = storage.active;
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
                rfa(obj.p2._der, obj);
                obj.p2 = point = editor.mo; // Выбираем вторую точку из под мыши
                pd(point, obj);
            }
            else items.push(point = pt); // или предыдущюю
            items.push(obj); // Отправляем линию. Теперь вторая точка используется как первая для новой линии.
            pt = new Pt(x, y); // Создаём вторую точку
            obj = new ctor(point, pt);
            view.needRedraw = true;
        },
        rightup: function() {ctl.pop(); return true;}
    };
    var pre =
    {
        move: onFreeMove,//function(x, y) {if(editor.pointAlign) onAlignedMove(x, y); else onFreeMove(x, y);},
        leftup: function(x, y) 
        {
            var point, mo = editor.mo;
            if(editor.pointAlign && mo && mo.pos) point = mo; // Выбираем первую точку
            else items.push(point = new Point(x, y)); // или создаём
            pt = new Pt(x, y); // Создаём вторую точку
            obj = new ctor(point, pt); // Создаём линию
            ctl.go(nx);            
        },
        rightup: ctl.pop
    };    
    function onCreate() 
    { 
    	ctl.call(pre);
    	if(typeof CToolbar !== "undefined") CToolbar.cancel.show(true);
    }
    ui('create/line', onCreate);
})(storage, ctl, editor, view);