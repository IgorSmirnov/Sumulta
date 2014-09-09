var tags = 
{
    html:'>', 
    head:'>', 
    body:'>', 
    script:'>', 
    title:'>',
    meta:'', 
    link:''
};

module.exports = function(data, html, tab)
{
    function processTag(tag, data, tb)
    {
        if(typeof data === 'string') return tb + "<" + tag + ">" + data + "</" + tag + ">";
        if(data instanceof Array)
        {
            var res = "";
            for(x in data) res += processTag(tag, data[x], tb);
            return res;
        }
        var x, tgs = false;
        for(x in data)
        {
            if(typeof tags[x] !== "undefined") tgs = true;   
        }
        if(tgs)
        {
            var res = tb + '<' + tag + '>';
            for(x in data)
                res += processTag(x, data[x], tb + tab);
            res += tb + '</' + tag + '>';
            return res;
        }
        else
        {
            var res = tb + '<' + tag;
            for(x in data) res += ' ' + x + '="' + data[x] + '"';
            res += '>';
            if(tags[tag] === '>') res += "</" + tag + ">";
            return res;
        }
    }
    return processTag('html', data.html, "\n");

}