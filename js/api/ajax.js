'use strict';

var ajax = new (function Ajax()
{
    function getXHR()
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
        return xhr;
    }
    function encodeQuery(query)
    {
        var data = [];
        for(var x in query)
            data.push(x + '=' + encodeURIComponent(query[x]));
        return data.join('&');
    }

    /*xmlhttp.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            if(xmlhttp.status == 200) {
       alert(xmlhttp.responseText);
         }
  }
};*/
    function send(method, url, settings) {
        var xhr = getXHR();
        var cb = settings ? settings.cb : undefined;
        if(settings && settings.query)
            url += '?' + encodeQuery(settings.query);
        xhr.open(method, url, !!cb);
        var contentType = settings && settings.contentType || 'application/x-www-form-urlencoded';
        if(method === 'POST')
        {
            xhr.setRequestHeader('Content-Type', contentType);
        }

        xhr.onreadystatechange = !cb ? undefined : function() {
            if (xhr.readyState == 4) {
                cb(xhr.status, xhr.responseText)
            }
        };
        var data = (settings && settings.data) || null;
        if(method === 'POST' && contentType === 'application/x-www-form-urlencoded')
            data = encodeQuery(data);
        xhr.send(data);
        return xhr.responseText;
    }
    this.get = function(url, settings) {
        return send('GET', url, settings);
    }
    this.post = function(url, settings) {
        return send('POST', url, settings);
    };
});