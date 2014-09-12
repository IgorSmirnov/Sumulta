function Controller(b){function g(a,d){var c=f.getBoundingClientRect(),e=document.body,r=document.documentElement;return{x:(a-(c.left+(window.pageXOffset||r.scrollLeft||e.scrollLeft)-(r.clientLeft||e.clientLeft||0))-b.offsetX)/b.scale,y:(d-(c.top+(window.pageYOffset||r.scrollTop||e.scrollTop)-(r.clientTop||e.clientTop||0))-b.offsetY)/b.scale}}function a(a,c,e){e&&(a=g(a,c),e(a.x,a.y)&&b.commit(d))}function e(a){if(d.wheel){var c=g(a.pageX,a.pageY);a.preventDefault();d.wheel(c.x,c.y,a.wheelDelta||
-a.detail)&&b.commit(d)}}function c(a){var b={},c=l[l.length-1],e;for(e in c)c.hasOwnProperty(e)&&"_"!=e[0]&&(b[e]=c[e]);for(e in a)a.hasOwnProperty(e)&&(b[e]=a[e]);a.leftdown&&!a.leftup?b.leftup=void 0:a.leftup&&!a.leftdown&&(b.leftdown=void 0);a.rightdown&&!a.rightup?b.rightup=void 0:a.rightup&&!a.rightdown&&(b.rightdown=void 0);d=b;d._enter&&d._enter()}document.oncontextmenu=function(){return!1};var f=b.canvas,d=null,l=[];this.states={};var h=null;f.onmousedown=function(b){var c=b.button;h=c;switch(c){case 0:a(b.pageX,
b.pageY,d.leftdown);break;case 2:a(b.pageX,b.pageY,d.rightdown)}};f.addEventListener("touchstart",function(b){f.onmousedown=void 0;f.onmouseup=void 0;f.onmousemove=void 0;var c=b.touches[0].pageX;b=b.touches[0].pageY;a(c,b,d.move);h=0;a(c,b,d.leftdown)});f.onmouseup=function(b){switch(h){case 0:a(b.pageX,b.pageY,d.leftup);break;case 2:a(b.pageX,b.pageY,d.rightup)}h=null};f.addEventListener("touchend",function(b){a(b.changedTouches[0].pageX,b.changedTouches[0].pageY,d.leftup)});f.onmousemove=function(b){a(b.pageX,
b.pageY,d.move)};var k=0;f.addEventListener("touchmove",function(b){+new Date<k||(a(b.touches[0].pageX,b.touches[0].pageY,d.move),k=+new Date+100)});f.ondblclick=function(b){a(b.pageX,b.pageY,d.dblclick);b.preventDefault()};f.addEventListener?(f.addEventListener("mousewheel",e,!1),f.addEventListener("DOMMouseScroll",e,!1)):f.attachEvent("onmousewheel",e);window.onresize=function(){b.onresize(d)};f.onkeydown=function(){alert("kd")};this.go=function(a){d?(d._leave&&d._leave(),c(a)):d=a};this.call=function(a){l.push(d);
c(a)};this.pop=function(){d._leave&&d._leave();if(0==l.length)throw"ctl.pop() stack overrun!";d=l.pop()}};var css={def:"#000",sel:"#F00",touch:"#888",back:"#FFF",font:"10px monospace"};function setCSS(b){document.getElementById("CSS").href=b;editor.OnCSS(b)};function Editor(b,g,a){function e(a,b,d,c){this.x=a;this.y=b;this.w=d;this.h=c;this.left=function(){return 0<this.w?this.x:this.x+this.w};this.top=function(){return 0<this.h?this.y:this.y+this.h};this.right=function(){return 0>this.w?this.x:this.x+this.w};this.bottom=function(){return 0>this.h?this.y:this.y+this.h};this.stroke=function(a){a.strokeStyle="#8080FF";a.strokeRect(this.x,this.y,this.w,this.h)}}this.mo=null;this.pointAlign=!0;var c=b.active,f=null,d=this;d.draw=function(a){a.lineCap="round";
a.lineJoin="round";var c=b.active,e=!0,f=[],g=[],l=[],h=d.mo,m;for(m in c){var n=c[m];if(n===h)(n._s&2?f:g).push(n),e=!1;else if(n._s&2)f.push(n);else if(n._s&1)g.push(n);else try{n.draw(a,0)}catch(k){c[m]&&l.push("#"+m+" "+c[m].constructor.name),c[m]=null}}for(m in f)try{f[m].draw(a,2)}catch(p){f[m]&&l.push("#"+m+" "+f[m].constructor.name)}for(m in g)try{g[m].draw(a,1)}catch(s){g[m]&&l.push("#"+m+" "+g[m].constructor.name)}e&&h&&h.draw(a,1);if(0<l.length){a=0;for(m in c)c[m]&&(c[a++]=c[m]);c.length=
a;alert("\u041e\u0448\u0438\u0431\u043a\u0430 \u043e\u0442\u0440\u0438\u0441\u043e\u0432\u043a\u0438 \u043e\u0431\u044a\u0435\u043a\u0442\u043e\u0432: \n"+l.join("\n"))}};var l,h,k={move:function(a,b){var e=a-l,f=b-h;l=a;h=b;var k=d.mo,q;for(q in c)c[q]._s&2&&c[q].moveBy&&c[q].moveBy(e,f);!k||k._s&2||!k.moveBy||k.moveBy(e,f);for(q in c)c[q]._s&=3;k&&(k._s&=3);return g.needRedraw=!0},leftup:a.pop},s={move:function(b,e){if(!(d.mo._s&2)){for(var f in c)c[f]._s&=-3;d.mo._s|=2}a.go(k);return k.move(b,
e)},leftup:function(b,c){a.pop();var e=d.mo;e._s&2?e._s&=-3:e._s|=2;return g.needRedraw=!0}},t={move:function(a,c){f.w=a-f.x;f.h=c-f.y;var d=f.left(),e=f.top(),l=f.right(),h=f.bottom(),k=b.active,m;for(m in k){var n=k[m];if(n.rHit){var p=n.rHit(d,e,l,h);p===!(n._s&1)&&(g.needRedraw=!0,p?n._s|=1:n._s&=-2)}}return!0},leftup:function(){for(var b in c){var d=c[b]._s;if(d&1){if(c[b].onSel&&!(d&2))c[b].onSel(!0);d|=2;d&=-2;c[b]._s=d}}a.pop();return g.needRedraw=!0},draw:function(a){f.stroke(a)}},u={move:function(b,
c){a.go(t);return t.move(b,c)},leftup:function(b,d){for(var e in c)if(c[e]._s&2){if(c[e].onSel)c[e].onSel(0);c[e]._s=0;g.needRedraw=!0}a.pop();return!0}},p={free:{move:function(a,b){for(var e=null,f=0,l=3/g.scale,h=c.length;h--;)if(!f||c[h].hp&&!(c[h].hp<f)){var k=c[h].hit(a,b,l);k&&(e=k,f=k.hp)}if(d.mo!=e)return d.mo&&(d.mo._s&=-2),d.mo=e,g.needRedraw=!0,e&&(e._s|=1),!0},leftdown:function(b,c){d.mo?(l=b,h=c,a.call(s)):(f=new e(b,c,0,0),a.call(u))},dblclick:function(a,b){var c=d.mo;if(c&&c.onDblClick)c.onDblClick(a,
b)},select:function(){a.call(p.select)},onlymove:function(){a.call(p.onlymove)}},select:{_enter:function(){CToolbar.select.check(!0)},leftdown:function(b,c){f=new e(b,c,0,0);a.call(p.selmove)},select:a.pop,onlymove:function(){a.go(p.onlymove)},_leave:function(){CToolbar.select.check(!1)}},onlymove:{_enter:function(){CToolbar.move.check(!0)},leftdown:function(b,c){Main.MX=b;Main.MY=c;f=new e(Main.MX,Main.MY,0,0);a.call(p.objonlymove)},onlymove:a.pop,select:function(){a.go(p.select)},_leave:function(){CToolbar.move.check(!1)}}};
a.states=p;a.go(p.free);g.needRedraw=!0;g.commit(p.free)};function Grid(b,g){var a=this;a.step=10;a.style="#808080";a.draw=function(e){var c=canvas.width,f=canvas.height;e.beginPath();var d,g=1/b.scale;e.lineWidth=.2;var h=a.step;for(d=Math.ceil(-b.offsetX/(h*b.scale))*h;d*b.scale+b.offsetX<c;d+=h)e.moveTo(d,-b.offsetY*g),e.lineTo(d,(f-b.offsetY)*g);for(d=Math.ceil(-b.offsetY/(h*b.scale))*h;d*b.scale+b.offsetY<f;d+=h)e.moveTo(-b.offsetX*g,d),e.lineTo((c-b.offsetX)*g,d);e.strokeStyle=a.style;e.stroke();e.lineWidth=1};g.align=function(b){b.x=Math.ceil(b.x/
a.step-1)*a.step;b.y=Math.ceil(b.y/a.step-1)*a.step};"undefined"!==typeof CMenu&&CMenu.Add({view:{grid:{label:"\u041b\u0438\u043d\u0435\u0439\u043a\u0430",_1:{label:"\u0420\u0435\u0448\u0451\u0442\u043a\u0430"},_2:{label:"\u0422\u043e\u0447\u043a\u0438"},_3:{label:"\u0423\u0431\u0440\u0430\u0442\u044c"},_4:{label:"\u041f\u0430\u0440\u0430\u043c\u0435\u0442\u0440\u044b"}}}})};var view=new View(document.getElementById("canvas"),document.getElementById("fast"));view.seq.push(view.clear);var ctl=new Controller(view),editor=new Editor(storage,view,ctl);Navi&&Navi(view,ctl);Grid&&(view.grid=new Grid(view,editor),view.seq.push(view.grid.draw));view.seq.push(editor.draw);window.onload=function(){window.onresize()};function Navi(b,g){var a,e,c=g.states,f={move:function(c,d){b.offsetX+=c*b.scale-a;b.offsetY+=d*b.scale-e;b.transform();return!0},rightup:g.pop,leftup:g.pop};c.navi=f;c.free.rightdown=function(c,d){a=c*b.scale;e=d*b.scale;g.call(f)};c.free.wheel=function(a,c,d){if(d){var e=b.scale,f=1.2;0>d&&(f=1/f);b.scale*=f;e-=b.scale;b.offsetX+=a*e;b.offsetY+=c*e;b.transform();return!0}};if("undefined"!==typeof CToolbar){var d={_enter:function(){CToolbar.hand.check(!0)},leftdown:c.free.rightdown,hand:g.pop,_leave:function(){CToolbar.hand.check(!1)},
select:function(){g.go(c.select)},onlymove:function(){g.go(c.onlymove)}};c.hand=d;c.free.hand=function(){g.call(d)};c.select.hand=function(){g.go(d)};c.onlymove.hand=function(){g["goto"](d)}}};var storage=new function(){var b={sheets:{"\u043b\u0438\u0441\u0442 1":[]}};this.data=b;this.active=b.sheets["\u043b\u0438\u0441\u0442 1"];this.ctors={};this.getJSON=function(){workspace.sheets["\u043b\u0438\u0441\u0442 1"]=Items;return JSON.stringify(workspace,function(b,a){if("_"===b||"_"!==b.charAt(0)){if("object"===typeof a&&a.ctor){var e={_:a.ctor},c;for(c in a)a.hasOwnProperty(c)&&"function"!==typeof a[c]&&(e[c]=a[c]);var f=a.dep;for(c in f){var d=f[c];if(e[d]instanceof Array){var l=e[d],h=
[],k;for(k in l)h[k]=Main.GetId(l[k]);e[d]=h}else e[d]=Main.GetId(e[d])}return e}return a}})}};function pd(b,g){b._der?b._der.push(g):b._der=[g]}function rfa(b,g){for(var a=0,e=0,c=b.length;e<c;e++){var f=b[e];f!==g&&(b[a++]=f)}b.length=a};function View(b,g){var a=this;a.scale=1;a.offsetX=0;a.offsetY=0;a.canvas=g?g:b;var e=b.getContext("2d"),c=g.getContext("2d");a.onresize=function(d){var f=b.clientHeight,h=b.clientWidth;b.height=f;b.width=h;g&&(g.height=f,g.width=h);e.setTransform(a.scale,0,0,a.scale,a.offsetX,a.offsetY);c.setTransform(a.scale,0,0,a.scale,a.offsetX,a.offsetY);a.needRedraw=!0;a.commit(d)};a.seq=[];a.needRedraw=!0;var f=!1;a.commit=function(d){f&&c.clearRect(-a.offsetX/a.scale,-a.offsetY/a.scale,b.width/a.scale,b.height/
a.scale);d.draw&&(d.draw(c),f=!0);if(a.needRedraw){d=a.seq;for(var g in d)d[g](e);a.needRedraw=!1}};a.clear=function(c){c.clearRect(-a.offsetX/a.scale,-a.offsetY/a.scale,b.width/a.scale,b.height/a.scale)};a.transform=function(){e.setTransform(a.scale,0,0,a.scale,a.offsetX,a.offsetY);c.setTransform(a.scale,0,0,a.scale,a.offsetX,a.offsetY);a.needRedraw=!0}};
