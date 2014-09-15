"use strict";

var Menu = (function()
{
    var menu = null;
    return function(name)
    {
        return function(doc, ui, parent, nm)
        {
            if(!menu) 
            {
                menu = doc.createElement('menu'); 
                menu.className = 'hmenu';
                doc.body.appendChild(menu);
            }
            if(!ui._menu) ui._menu = doc.createElement('li');
            if(parent._menu)
            {
                var m = parent._menu, ul;
                if(m.children.length) ul = m.children[0];
                else {ul = doc.createElement('ul'); m.appendChild(ul);}
                ul.appendChild(ui._menu);
            }
            else menu.appendChild(ui._menu);
            ui._menu.innerText = nm || name;
            if(ui.exec) ui._menu.onclick = ui.exec;
        }
    }
})();
/*var CMenu =
{
    Root:null,
    Add:function(o, r)
    {
        if(!r) r = this.Root;
        for(var i in o) if(o.hasOwnProperty(i) && i != "label" && i != "click")
        {
            var id = "menu" + i;
            var li = null;
            if(i.charAt(0) != "_")for(var t in r.children) 
                if(r.children[t].id == id) 
                    {
                        li = r.children[t];
                        break;
                    }
            if(!li)
            {
                li = document.createElement("li");
                if(o[i].label == "-") {li.className = "msep"; r.appendChild(li); continue;}
                li.innerHTML = o[i].label;
                if(i.charAt(0) != "_") li.id = id;
                li.onclick = o[i].click;
                r.appendChild(li);
            }
            var o2 = o[i];
            for(var g in o2) if(o2.hasOwnProperty(g) && g != "label" && g != "click")
            {
                var ul = li.getElementsByTagName('ul')[0];
                if(!ul)
                {
                    ul = document.createElement("ul");
                    li.appendChild(ul);
                }
                this.Add(o2, ul);
                break;
            }

        }


    }

};

CMenu.Root = document.getElementById("mainmenu");*/