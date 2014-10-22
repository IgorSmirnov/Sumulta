Workarea = (canvas, fast) ->
	view = new View canvas, fast
	view.seq.push view.clear
	ctl = new Controller view, window
	editor = new Editor storage, view, ctl
	if Navi?
		Navi view, ctl
	if Grid?
		view.grid = new Grid view, editor
		view.seq.push view.grid.draw;
	view.seq.push editor.draw

	window.onload = ->
		window.onresize()
