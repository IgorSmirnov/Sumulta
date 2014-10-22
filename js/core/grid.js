"use strict";

function Grid(view, editor)
{
    var g = this;
    g.step = 10;
    g.style = "#808080";
    g.draw = function(ctx)
    {
        var w = canvas.width, h = canvas.height;
        ctx.beginPath();
        var x, os = 1 / view.scale;
        ctx.lineWidth = 0.2;
        var step = g.step;
        var y0 = -view.offsetY * os, y1 = (h - view.offsetY) * os;
        for(x = Math.ceil(-view.offsetX / (step * view.scale)) * step; x * view.scale + view.offsetX < w; x += step)
        {
            ctx.moveTo(x, y0);
            ctx.lineTo(x, y1);
        }
        y0 = -view.offsetX * os;
        y1 = (w - view.offsetX) * os;
        for(x = Math.ceil(-view.offsetY / (step * view.scale)) * step; x * view.scale + view.offsetY < h; x += step)
        {
            ctx.moveTo(y0, x);
            ctx.lineTo(y1, x);
        }
        ctx.strokeStyle = g.style;
        ctx.stroke();
        ctx.lineWidth = 1.0;
    }
    editor.align = function(pos)
    {
        pos.x = Math.ceil(pos.x / g.step - 1) * g.step;
        pos.y = Math.ceil(pos.y / g.step - 1) * g.step;
    }
    /*Redraw: function()
    {
        Grid.MainRedraw();
        if(!MouseObject)
        {
            var x = Main.MX;
            var y = Main.MY;
            ctx.beginPath();
            var s = 3;
            ctx.moveTo(x, y - s);
            ctx.lineTo(x, y + s);
            ctx.moveTo(x - s, y);
            ctx.lineTo(x + s, y);
            ctx.strokeStyle = "#008000";
            ctx.stroke();
        }

    },*/
    if(typeof ui !== "undefined")
    {
        ui('view/grid/lines', function(){});
        ui('view/grid/dots', function(){});
        ui('view/grid/none', function(){});
        ui('view/grid/props', function(){});


        /*view:{grid: {label: "Линейка", 
        _1:{label: "Решётка"},
        _2:{label: "Точки"},
        _3:{label: "Убрать"},
        _4:{label: "Параметры"}*/
    }//}});
};


/*Main.Clear = Grid.draw;
Grid.MAM = Main.OnAlignedMove;
Main.OnAlignedMove = Grid.OnAlignedMove;
States.free.redraw = Grid.Redraw;
Main.Modules.push(Grid);*/
