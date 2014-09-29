'use strict';

var log      = require('winston');
var mongoose = require('mongoose');

// Module 'get' gets items in accordance with query parameters

module.exports = function(model, fields)
{
    var fs = {};
    if(fields) for(var x in fields) fs[fields[x]] = 1;
    else fs = {name:1};
    var Model = mongoose.model(model);

    return function(req, res, next)
    {
        // 1. Initialize selector
        var selector = null;
        if(req.query && req.query.q && req.query.q != '') 
            selector = {name: {$regex: req.query.q, $options: '-i'}};
        // 2. Make query
        var query = Model.find(selector, fs);//);
        // 3. Calculate size of total unsorted result
        Model.count(selector, function(err, count)
        {
            if(err) return next(err);
            if(req.query)
            {
                var q = req.query;
                // 4. if 'sortby' specified, then add sorting
                if(q.sortby && q.sortby != '') 
                {
                    var sort = {};
                    sort[q.sortby] = 1;
                    query = query.sort(sort);
                }
                // 5. if 'limit' and/or 'offset' specified, then add limit and/or skip
                if(q.offset && q.offset != '')
                    query = query.skip(q.offset);
                if(q.limit && q.limit != '')
                    query = query.limit(q.limit);
            }
            // 6. Make query with all applied cautions
            query.exec(function(err, items)
            {
                if(err) return next(err);
                // 7. Return result
                if(items.length)
                {
                    log.info(model + 's found');
                    res.json(items);//{result:'found', count: count, items: items});
                }
                else
                {
                    log.warn(model + 's not found');
                    res.statusCode = 404;
                    res.json({result: false, count: count});
                }
            });
        });
    };
};