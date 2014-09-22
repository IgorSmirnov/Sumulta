function append(tag, parent) {
    var r = document.createElement(tag);
    (parent || document.body).appendChild(r);
    return r;
}

function byId(id) { return document.getElementById(id);}

function show(id) {
	document.getElementById(id).hidden = false;
}

function hide(id) {
	document.getElementById(id).hidden = true;
}