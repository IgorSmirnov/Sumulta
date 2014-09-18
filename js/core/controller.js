"use strict";
// Обработка событий, машина состояний
function Controller(view, window)
{
    document.oncontextmenu = function (){return false;};
    var canvas = view.canvas;
    var ctl = this;
    var state = null, stack = [];
    this.states = {};
    // Обработчики мыши и касаний
    function getMousePos(px, py)
    {
        var box = canvas.getBoundingClientRect();
        var body = document.body;
        var docElem = document.documentElement;
        var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop;
        var scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;
        var clientTop = docElem.clientTop || body.clientTop || 0;
        var clientLeft = docElem.clientLeft || body.clientLeft || 0;
        var top  = box.top +  scrollTop - clientTop;
        var left = box.left + scrollLeft - clientLeft;
        return {x:(px - left - view.offsetX) / view.scale, y:(py - top - view.offsetY) / view.scale};
    }    
    function onMouse(px, py, method)
    {
        if(!method) return;
        var mp = getMousePos(px, py);
        if(method(mp.x, mp.y)) view.commit(state);
    }
    var mouseDown = null;
    canvas.onmousedown = function(evt)
    {
        var b = evt.button;
        mouseDown = b;
        switch(b)
        {
            case 0: onMouse(evt.pageX, evt.pageY, state.leftdown); break;
            case 2: onMouse(evt.pageX, evt.pageY, state.rightdown);break;
        }
    };
    canvas.addEventListener("touchstart", function(evt)
    {
        canvas.onmousedown = undefined;
        canvas.onmouseup = undefined;
        canvas.onmousemove = undefined;
        var x = evt.touches[0].pageX, y = evt.touches[0].pageY;
        onMouse(x, y, state.move);
        mouseDown = 0;
        onMouse(x, y, state.leftdown);
    });
    canvas.onmouseup = function(evt)
    {
        switch(mouseDown)
        {
            case 0: onMouse(evt.pageX, evt.pageY, state.leftup); break;
            case 2: onMouse(evt.pageX, evt.pageY, state.rightup); break;
        }
        mouseDown = null;
    };
    canvas.addEventListener("touchend", function(evt) {onMouse(evt.changedTouches[0].pageX, evt.changedTouches[0].pageY, state.leftup);});
        
    canvas.onmousemove = function(evt) 
    {
        onMouse(evt.pageX, evt.pageY, state.move);
    };
        
    var time = 0;
    canvas.addEventListener("touchmove", function(evt)
    {
        if(+new Date() < time) return;
        onMouse(evt.touches[0].pageX, evt.touches[0].pageY, state.move);
        time = +new Date() + 100;
    });
    canvas.ondblclick = function(evt) {onMouse(evt.pageX, evt.pageY, state.dblclick); evt.preventDefault();};
    function onMouseWheel(evt)
    {
        if(!state.wheel) return;
        var mp = getMousePos(evt.pageX, evt.pageY);
        var e = /*window.event ||*/ evt; // old IE support
        e.preventDefault();
        var delta = e.wheelDelta || -e.detail;
        if(state.wheel(mp.x, mp.y, delta)) view.commit(state);
    }
    if(canvas.addEventListener) 
    {
        // IE9, Chrome, Safari, Opera
        canvas.addEventListener("mousewheel", onMouseWheel, false);
        // Firefox
        canvas.addEventListener("DOMMouseScroll", onMouseWheel, false);
    }else canvas.attachEvent("onmousewheel", onMouseWheel);
    
    window.onresize = function() {view.onresize(state);}
    
    canvas.onkeydown = function()
    {
        alert("kd");
    };
    // Работа с состояниями
    function setState(newState)
    {
        var result = {}; // Новое состояние - комбинация предущего и требуемого
        var pst = stack[stack.length - 1];
        for(var x in pst)      if(  pst.hasOwnProperty(x) && x[0] != '_') result[x] = pst[x];
        for(var x in newState) if(newState.hasOwnProperty(x)            ) result[x] = newState[x];
        if(newState.leftdown && !newState.leftup) result.leftup = undefined;
        else if(newState.leftup && !newState.leftdown) result.leftdown = undefined;
        if(newState.rightdown && !newState.rightup) result.rightup = undefined;
        else if(newState.rightup && !newState.rightdown) result.rightdown = undefined;

        state = result;
        if(state._enter) state._enter();
    }
    this.update = function()
    {
        view.needRedraw = true;
        view.commit(state);
    };    
    this.go = function(newState)
    {
        if(!state) {state = newState; return;}
    	if(state._leave) state._leave();
    	setState(newState);
    };
    this.call = function(newState)
    {
        stack.push(state);
        setState(newState);
    };
    this.pop = function()
    {
        if(stack.length == 0) throw Error("Controller.pop() stack overrun!");
    	if(state._leave) state._leave();
        state = stack.pop();
    };

}