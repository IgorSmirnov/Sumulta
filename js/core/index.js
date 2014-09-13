"use strict";
var view = new View(document.getElementById('canvas'), document.getElementById('fast'));
view.seq.push(view.clear);
var ctl = new Controller(view, window);
var editor = new Editor(storage, view, ctl);
if(Navi) Navi(view, ctl);
if(Grid)
{
	view.grid = new Grid(view, editor);
	view.seq.push(view.grid.draw);
}
view.seq.push(editor.draw);

window.onload = function()
{
	window.onresize();
}