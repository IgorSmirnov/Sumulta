'use strict';

var css = 
{
    def: "#000",
    sel: "#F00",
    touch: "#888",
    back: "#FFF",
    font: '10px monospace'
}

function setCSS(f)
{
    document.getElementById('css').href = '/css/' + f + '.css';
    //editor.OnCSS(f);
}

ui('view/theme/lite',   function(){setCSS('lite');});
ui('view/theme/matrix', function(){setCSS('matrix');});
