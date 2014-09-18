'use strict';

var imp = function Import(doc, ui) {
	var imp = null, handlers = {};
	function createImport() {
		imp = doc.createElement("input");
		imp.type = 'file';
		imp.style.display = 'none';
		imp.multiple = true;
		imp.onchange = processFiles;
		doc.body.appendChild(imp);
	}
	function onload(handler) {
		return function(e){handler(e.target.result);};
	}
	function processFiles(evt) {
		var files = evt.target.files, buf = {}, x, y, errors = [];
		for(x in handlers) buf[x] = [];
		for(x = files.length; x--;) {
			var name = files[x].name;
			for(y = name.length; y--;) if(name[y] === '.') break;
			var ext = name.substr(y + 1);
			if(buf[ext]) buf[ext].push(files[x]);
			else errors.push('Unknown extension: ' + ext);
		}
		for(x in buf) {
			var bf = buf[x];
			var ol = onload(handlers[x]);
			for(y in bf) {
				var reader = new FileReader();
				reader.onload = ol;
				reader.readAsText(bf[y]);
			}
		}
		if(errors.length) alert(errors.join('\n'));
	}
	return function(ext, cb) {
		if(!imp) {
			createImport();
			ui('project/import', function() {imp.click();});
		}
		handlers[ext] = cb;
	}
}(document, ui);