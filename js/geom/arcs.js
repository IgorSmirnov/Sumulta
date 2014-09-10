"use strict";

function Arc(p1, p2, A)
{
    this.p1 = p1;
    this.p2 = p2;
    this.a = (A ? A : 90) * Math.PI / 180;
    this._P =
    {
        o: this,
        pos: function() {return {x:this.o.cx, y:this.o.cy};},
        moveBy: function(x, y)
        {
            var A = this.o.p1.pos();
            var B = this.o.p2.pos();
            var ABx = B.x - A.x;
            var ABy = B.y - A.y;
            var AB2 = ABx * ABx + ABy * ABy;
            var ABd2 = Math.sqrt(AB2) * 0.5;
            var t = ABd2 * Math.tan((Math.PI - this.o.a) * 0.5) - (ABy * x - ABx * y) / ABd2 * 0.5;
            //console.log("a = " + (this.o.a * 180 / Math.PI) + ", AB = " + (ABd2 * 2) + ", M = " + ((ABy * x - ABx * y) / ABd2 * 0.5));
            this.o.a = 2 * Math.atan2(ABd2, t);
        },
        GetId: function(){ return '' + Main.GetId(this.o) + ".0";},
        draw: function(ctx, type)
        {
            ctx.strokeStyle = (this._s & 2) ? "#FF0000" : "#000000";
            var p = this.pos();
            if(type > 0 || (this._s & 2)) ctx.strokeRect(p.x - 2, p.y - 2, 5, 5);
        }
    };
    if(p1) this.Update();
}

Arc.prototype = 
{
    ctor: "Arc", 
    dep: ["p1", "p2"],
    serialize: function() { return Items.indexOf(this.p1).toString() + ',' + Items.indexOf(this.p2) + ',' + (this.a * 180 / Math.PI);},
    toJSON: function(key){return {p1:Main.GetId(this.p1), p2:Main.GetId(this.p2), a: this.a * 180 / Math.PI, _:"Arc"};},
    OnLoad: function() {/*this.p1 = Main.ById(this.p1); this.p2 = Main.ById(this.p2);*/ this.a *=  Math.PI / 180; return this.p1 && this.p2;},
    child: function(c) {return this._P;},
    Update: function()
    {
        var p1 = this.p1.pos();
        var p2 = this.p2.pos();
        var dx = (p2.x - p1.x) * 0.5;
        var dy = (p2.y - p1.y) * 0.5;
        var ct = 1.0 / Math.tan(this.a * 0.5);
        var rx = dx - dy * ct;
        var ry = dy + dx * ct;
        this.cx = p1.x + rx;
        this.cy = p1.y + ry;
        this.R = Math.sqrt(rx * rx + ry * ry);
        this.a1 = Math.atan2(-ry, -rx);
        this.a2 = Math.atan2(p2.y - this.cy, p2.x - this.cx);
    },
    draw: function(ctx, type)
    {
        var color = this.color ? this.color : css.def;
        ctx.strokeStyle = (type & 2) ? css.sel :((type & 1) ? css.touch: color);
        ctx.lineWidth = 1;
        ctx.beginPath();
        this.Update();
        ctx.arc(this.cx, this.cy, this.R, this.a1, this.a2);
        ctx.stroke();
        if((this._s & 2) || type > 0) this._P.draw(ctx, 1);
    },
    hp:8,
    hit: function(x, y, adm)
    {
        this.Update();
        var p = this._P.pos();
        if(Math.abs(p.x - x) < adm && Math.abs(p.y - y) < adm) return this._P;
        var dx = x - this.cx;
        var dy = y - this.cy;
        if(Math.abs(Math.sqrt(dx * dx + dy * dy) - this.R) > adm) return null;
        var a = Math.atan2(dy, dx);
        if(this.a2 > this.a1) return (a > this.a2 || a < this.a1) ? null : this;
        else return (a > this.a2 && a < this.a1) ? null : this;
    },
    rHit: function(l, t, r, b)
    {
        var p1 = this.p1.pos();
        var p2 = this.p2.pos();
        return (p1.x > l && p1.y > t && p1.x < r && p1.y < b) && (p2.x > l && p2.y > t && p2.x < r && p2.y < b);
    },
    vec: function(P)
    {
        var p = P.pos();
        if(P === this.p1) return {x: (this.cy - p.y) / this.R, y: (p.x - this.cx) / this.R};
        if(P === this.p2) return {x: (p.y - this.cy) / this.R, y: (this.cx - p.x) / this.R};
        return null;
    },
    moveBy: function(dx, dy)
    {
        if(!(this._s & 4))
        {
            this.p1.moveBy(dx, dy);
            this.p2.moveBy(dx, dy);
            this._s |= 4;
        }
    }
};

(function(storage, ctl, editor, view)
{
    var pt = null, obj = null, Pt = Point, ctor = Arc;
    var items = storage.active;
    var onFreeMove = ctl.states.free.move;   
    storage.ctors["Arc"] = Arc;

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
            view.needFast = true;
        },
        rightup: function(){ctl.pop(); return true;}
    };
    var pre =
    {
        move: onFreeMove,//function(x, y) {if(Main.PointAlign) Main.OnAlignedMove(x, y); else Main.OnFreeMove(x, y);},
        leftup: function(x, y) 
        {
            var point, mo = editor.mo;
            if(editor.pointAlign && mo && mo.pos) point = mo; // Выбираем первую точку
            else items.push(point = new Pt(x, y)); // или создаём
            pt = new Pt(x, y); // Создаём вторую точку
            obj = new ctor(point, pt); // Создаём линию
            ctl.go(nx);
        },
        rightup: ctl.pop
    };
    CMenu.Add({create:{_: {label: "Дугу", click: function() {ctl.call(pre);}}}});
})(storage, ctl, editor, view);