function pd(o, d) {o._der ? o._der.push(d) :(o._der = [d]);}// Добавить к объекту o зависимый от него d

function rfa(a, v)
{
    var o = 0;
    for(var i = 0, e = a.length; i < e; i++)
    {
        var t = a[i];
        if(t !== v) a[o++] = t;
    }
    a.length = o;
}