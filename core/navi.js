"use strict";

(function(view, ctl)
{
    var MX, MY;
    function onMove(mx, my)
    {
        view.offsetX += mx * view.scale - MX;
        view.offsetY += my * view.scale - MY;
        view.transform();
    }
    function onMouseWheel(x, y, delta)
    {
        if(!delta) return;
        var OScale = view.scale;
        var m = 1.2;
        if(delta < 0) m = 1.0 / m;  	
        view.scale *= m;
        //Main.adm /= m;
        OScale -= view.scale;
        view.offsetX += x * OScale;
        view.offsetY += y * OScale;
        view.transform();
    }
    var states = ctl.states, navi = {move: onMove, rightup: ctl.pop, leftup:ctl.pop};
    states.navi = navi;
    states.free.rightdown = function(x, y)
    {
        MX = x * view.scale;
        MY = y * view.scale;
        ctl.call(navi);
    };
    states.free.wheel = onMouseWheel;

    if(typeof CToolbar !== "undefined")
    {
        var hand = 
        {
            _enter:function() {CToolbar.hand.check(true);},
            leftdown:states.free.rightdown,
            hand: ctl.pop,
            _leave:function() {CToolbar.hand.check(false);},
            select:function() {ctl.goto(states.select);},
            onlymove:function() {ctl.goto(states.onlymove);}                	    
        };
        states.hand = hand;
        states.free.hand = function() {ctl.call(hand);};
        states.select.hand = function() {ctl.goto(hand);};
        states.onlymove.hand = function() {ctl.goto(hand);};
    }
})(view, ctl);

