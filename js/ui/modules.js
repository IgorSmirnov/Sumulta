(function() {
    function load()
    {
        for(var x in arguments)
        {
            var script = document.createElement('script');
            script.src = arguments[x];
            script.async = false;
            document.head.appendChild(script);
        }
    }
    //var electro = null;
    ui('project/modules/electro', function() {
        load('/js/electro/schematic.js',
             '/js/electro/kicad.js',
             '/js/electro/network.js');
    });
    ui('project/modules/cnc', function() {
        load('/js/cnc.js');
    });
})();