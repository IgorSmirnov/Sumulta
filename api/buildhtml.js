var obj2html = require('./obj2html');
var html = require('./index.html');
var script = 
html.html.body.script[0] = {src: 'lang/en.js'};

var result = obj2html(html, "", "    ");

console.log(result);