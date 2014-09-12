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
    document.getElementById('CSS').href = f;
    editor.OnCSS(f);
}
