"use strict";

function Block(r)//x, y, w, h, Text)
{
    this.setFontSize(ctx, 10);
    for(x in r) if(r.hasOwnProperty(x)) this[x] = r[x];
    this._P = [
        {
            pos:function(){return {x:this.o.x, y:this.o.y};},
            moveBy:function(x, y){this.o.x += x; this.o.y += y; this.o.w -= x; this.o.h -= y;}
        },
        {
            pos:function(){return {x:this.o.x + this.o.w, y:this.o.y};},
            moveBy:function(x, y){this.o.w += x; this.o.y += y; this.o.h -= y;}
        },
        {
            pos:function(){return {x:this.o.x, y:this.o.y + this.o.h};},
            moveBy:function(x, y){this.o.x += x; this.o.h += y; this.o.w -= x;}
        },
        {
            pos:function(){return {x:this.o.x + this.o.w, y:this.o.y + this.o.h};},
            moveBy:function(x, y){this.o.w += x; this.o.h += y;}
        },
        {
            pos:function(){return {x:this.o.x + (this.o.w / 2), y:this.o.y};},
            moveBy:function(x, y){this.o.y += y; this.o.h -= y;}
        },
        {
            pos:function(){return {x:this.o.x + (this.o.w / 2), y:this.o.y + this.o.h};},
            moveBy:function(x, y){this.o.h += y;}
        },
        {
            pos:function(){return {x:this.o.x, y:this.o.y + (this.o.h / 2)};},
            moveBy:function(x, y){this.o.x += x; this.o.w -= x;}
        },
        {
            pos:function(){return {x:this.o.x + this.o.w, y:this.o.y + (this.o.h / 2)};},
            moveBy:function(x, y){this.o.w += x;}
        }
    ];
    this.exps = [];
    var PtDraw = function(ctx, Type)
    {
        ctx.strokeStyle = this._sel ? "#FF0000" : "#000000";
        var p = this.pos();
        if(Type > 0 || this._sel)
        {
            ctx.lineWidth = 1;
            ctx.strokeRect(p.x - 2, p.y - 2, 4, 4);
        } //else ctx.strokeRect(this.x - 1, this.y - 1, 3, 3);
    };
    var GetId = function(){ return '' + Items.indexOf(this.o) + '.' + this.x;};
    for(var x = this._P.length - 1; x >= 0; x--)
    {
        this._P[x].o = this;
        this._P[x].x = x;
        this._P[x].draw = PtDraw;
        this._P[x].GetId = GetId;
    }

    if(this.text) this.text = this.text.split("\n");
    this.child = function(c) {return this._P[c];};
    this.OnLoad = function(_sel)
    {
        if(this.x && this.y && this.w && this.h) return true;
        return false;
    };
}

Block.prototype = 
{
    toJSON: function()
    {
        var r = {_:"Block"};
	for(var x in this) if(this.hasOwnProperty(x) && x.charAt(0) !== '_') r[x] = this[x];
	return r;		
    },
    hit: function(x, y)
    {
        for(var i = this._P.length - 1; i >= 0; i--)
        {
            var p = this._P[i].pos();
            if(Math.abs(p.x - x) < 3 && Math.abs(p.y - y) < 3)
                return this._P[i];
        }
       
        if(x < this.x) return null;
        if(x > this.x + this.w) return null;
        if(y < this.y) return null;
        if(y > this.y + this.h) return null;
        if(this.text)
        {
            var txt = this.text;
            var l = this.getTextLayout();
            var Y = Math.floor((y - l.y) / l.dy);
            var X = Math.floor((x - l.x) / l.dx);
            if(X >= 0 && Y >= 0 && Y < txt.length && X < txt[Y].length)
            {
                var t = txt[Y];
                var e = /\w/;
                if(!e.test(t.charAt(X))) return this;
                var minX = X;
                while(minX > 0 && e.test(t.charAt(minX - 1))) minX--;
                var maxX = X + 1;
                while(maxX < t.length && e.test(t.charAt(maxX))) maxX++;
                maxX--;

                var r = 
                {
                    o:this,
                    x:minX,
                    l:maxX - minX + 1,
                    y:Y,
                    draw: function(ctx, Type)
                    {
                        var l = this.o.getTextLayout();
                        var x = l.x + this.x * l.dx;
                        var y = l.y + this.y * l.dy;
                        ctx.lineWidth = 1;
                        ctx.strokeStyle = "#000";
                        ctx.strokeRect(x, y + 1, this.l * l.dx, l.dy + 1);
                    },
                    pos: function()
                    {
                        var l = this.o.getTextLayout();
                        var x = l.x + (this.x + this.l) * l.dx;
                        var y = l.y + (this.y + 1) * l.dy + 2;
                        return {x: x, y: y};
                    }
                };
                this.exps.push(r);
                return r;
            }
        } 
        return this;
    },
    OnOk: function()
    {
        var Memo = document.getElementById("blocktext");
        this.text = undefined;
        if(Memo.value !== "") this.text = Memo.value.split("\n");
        hideBlockDialog();
    },
    moveBy: function(dx, dy)
    {
        if(!(this._s & 4)) {this.x += dx; this.y += dy; for(var x in this._P) this._P[x]._s |= 4;};
    },
    setFontSize: function(ctx, s)
    {
	this.fsize = s;
        this._font = s.toString() + "px monospace";
        this._dx = ctx.measureText("X").width;
    },
    getTextLayout: function()
    {
        var step = this.fsize;
        var l = this.text ? this.text.length : 0;
        var y = this.y + (this.h * 0.5) - (l * step / 2);
        return {
            x: this.x + step,
            y: y,
            dx: this._dx,
            dy: step
        };
    },
    draw: function(ctx, Type)
    {
        ctx.lineWidth = 1;
        ctx.strokeStyle = "#000";
        ctx.fillStyle = this._sel ? "#FFE0E0" :/*(Type > 0 ? "#E0E0E0":*/ "#FFFFFF";//);// = Type ? "": ;
        if(this.type && this.type === "if")
        {
            ctx.beginPath();
            ctx.moveTo(this.x,              this.y + this.h / 2);
            ctx.lineTo(this.x + this.w / 2, this.y             );
            ctx.lineTo(this.x + this.w,     this.y + this.h / 2);
            ctx.lineTo(this.x + this.w / 2, this.y + this.h);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
	}
	else
	{
            ctx.fillRect(this.x, this.y, this.w, this.h);
            ctx.strokeRect(this.x, this.y, this.w, this.h);
	}
	if(this.text)
	{
            var l = this.getTextLayout();
			var a = l.x, b = l.y;
			ctx.textBaseline = "top";
			ctx.fillStyle = "#000000";
			ctx.font = this._font;
			var x, e;
			for(x = 0, e = this.text.length; x < e; x++, b += l.dy)
				ctx.fillText(this.text[x], a, b);
		}
		if(this._sel || Type > 0) for(var x = this._P.length; x--; ) this._P[x].draw(ctx, 1);
		var y = 0;
		for(var x in this.exps)
		{
			var e = this.exps[x];
			if(e === MouseObject) this.exps[y++] = e;
			else if(e._der && e._der.length > 0) { e.draw(ctx, 0); this.exps[y++] = e;}
		}
		this.exps.length = y;
	},
	autoSize: function(ctx)
	{
            ctx.font = this._font;
	    var l = this.text.length;
	    var lay = this.getTextLayout();
	    this.h = (l + 1) * lay.dy;
	    var mx = 10;
	    for(var x = 0; x < l; x++)
	    {
	        var w = ctx.measureText(this.text[x]).width;
	        if(w > mx) mx = w;
	    }
	    this.w = mx + (lay.x - this.x) * 2;
	},
	onDblClick: function()
	{
            if(Dialogs) Dialogs.Create(
	    {
	    	title:"Свойства",
	        update:Main.Redraw,
	        data:
	        {
	            text:{name:"Текст", tag:"textarea"},
	            type:{name:"Тип", options:[""]},
	            x:"X",
	            y:"Y",
	            w:"Ширина",
	            h:"Высота"
	        }
        }, this);        
    }
};

(function(storage, ctl, editor, view)
{
    var obj = null, ctor = Block, items = storage.active;
    var onFreeMove = ctl.states.free.move;
    storage.ctors["Block"] = ctor;
    var nx =
    {
        draw:function(ctx) {obj.draw(ctx, 1);},
        move: function(x, y)
        {
            if(Main.PointAlign) Main.OnAlignedMove(x, y); else Main.OnFreeMove(x, y);
            if(obj.x + obj.w != x || obj.y + obj.h != y)
            {
                //Main.NeedRedraw = true;
                obj.w = x - obj.x;
                obj.h = y - obj.y;
            }
        },
        leftup: function(x, y)
        {
            if(obj.w < 0) { obj.x += obj.w; obj.w = -obj.w;}
            if(obj.h < 0) { obj.y += obj.h; obj.h = -obj.h;}
            items.push(obj);
            ctl.pop();
        }
    };
    var pre =
    {
        move: onFreeMove,
        leftup: function(x, y) 
        {
            var p, mo = editor.mo;
            if(editor.pointAlign && mo && mo.pos) // Выбираем первую точку
            {
                p = mo.pos();
                obj = new ctor({x:p.x, y:p.y, w:1, h:1});
            }
            else obj = new ctor({x:x, y:y, w:1, h:1}); // или создаём
            ctl.go(nx);
        },
        rightup: ctl.pop
    };

    CMenu.Add({create:{_: {label: "Блок", click: function() {ctl.call(pre);}}}});
})(storage, ctl, editor, view);