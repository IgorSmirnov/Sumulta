'use strict';

var ajax = new (function Ajax()
{
    var xhr = null;
    if(window.XMLHttpRequest) xhr = new XMLHttpRequest();
    else try {
        xhr = new ActiveXObject("Msxml2.XMLHTTP");
    } catch (e) {
        try {
          xhr = new ActiveXObject("Microsoft.XMLHTTP");
        } catch (E) {xhr = null;}
    }
    function encodeQuery(query)
    {
        var data = '';
        for(var x in query)
            data += ((data === '') ? '?' : '&') + x + '=' + encodeURIComponent(query[x]);
        return data;
    }
    function send(method, url, settings)
    {
        var cb = settings ? settings.cb : undefined;
        if(settings && settings.query) url += encodeQuery(settings.query);
        xhr.open(method, url, !!cb);
        xhr.onreadystatechange = cb;
        xhr.send((settings && settings.data) ? settings.data : null);
        return xhr.responseText;
    }
    this.get = function(url, settings)
    {
        return send('GET', url, settings);
    }
    this.post = function(url, settings)
    {
        return send('POST', url, settings);
    };
});