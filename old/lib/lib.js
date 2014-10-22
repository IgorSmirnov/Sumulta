'use strict';
///////////// AJAX ///////////////////////////////////////////////////////////////
var ajax = new (function Ajax()
{
    function encodeQuery(query)
    {
        var data = [];
        for(var x in query)
            data.push(x + '=' + encodeURIComponent(query[x]));
        return data.join('&');
    }

    function send(method, url, settings) {
        var xhr = new XMLHttpRequest();
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

///////////// javascript //////////////////////////////////////////////////////////

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

/////////////// DOM /////////////////////////////////////////////////////////////////

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

//////////////// REST API //////////////////////////////////////////////////////////

var api = new (function(ajax)
{
    this.getUsers = function(func, query)
    {
        function cb(status, text) {
            var err = (status === 200) ? null : status;
            var data = JSON.parse(text);

            func(err, data);
        }
        ajax.get('/users.json', {
            cb: cb, query:query});
    };
    this.getProjects = function(func, query)
    {
        function cb(status, text) {
            var err = (status === 200) ? null : status;
            var data = JSON.parse(text);

            func(err, data);
        }
        ajax.get('/projects.json', {
            cb: cb, query:query});
    };
    this.getNews = function(func, query)
    {
        function cb(status, text) {
            var err = (status === 200) ? null : status;
            var data = text ? JSON.parse(text) : {};

            func(err, data);
        }
        ajax.get('/news.json', {
            cb: cb, query:query});
    };
    this.register = function()
    {
        var user = byId('reguser').value;
        var pass = byId('regpass').value;
        var pass2 = byId('regpass2').value;
        if(!user || !pass || pass !== pass2) return;
        ajax.post('/auth/register', {
            data:{username: user, password: pass},
            cb: function(status, text)
            {
                var data = JSON.parse(text);
                switch(data.result)
                {
                    case 'registered': location.href = '/' + user + '/'; return;
                    case 'exists': alert('Логин занят'); return;
                    case 'error': alert(data.message); return;
                }
            }
        })

    }
    this.login = function(done)
    {
        var username = byId('loguser').value;
        var pass = byId('logpass').value;
        if(!user || !pass) return;
        ajax.post('/auth/login', {
            data:{username: username, password: pass},
            cb: function(status, text)
            {
                var data = JSON.parse(text);
                switch(data.result)
                {
                    case 'authorized': user.name = data.name; user.rights = data.rights; done(true); break;
                    case 'error': alert(data.message); done(false); break;
                    case false: alert('Неверный логин или пароль'); done(false); break;
                }
            }
        })

    }
    this.logout = function(done)
    {
        ajax.post('/auth/logout', {
            cb: function(status, text)
            {
                var data = JSON.parse(text);
                switch(data.result)
                {
                    default:
                    case 'unauthorized': user.name = 'guest'; user.rights = ''; done(true); break;
                    case 'error': alert(data.message); done(false); break;
                }
            }
        })
    }

})(ajax);