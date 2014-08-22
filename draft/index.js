function require(name)
{
    


}


window.onload = function()
{
    function loadLocation()
    {
        var s = decodeURIComponent(window.location.search.substr(1)).split('&'), r = {};
        for(var x in s)
        {
            var t = s[x].split('=');
            r[t[0]] = t[1];
        }
        return r;
    }
    function loadModule(m)
    {
    
    
    }









}