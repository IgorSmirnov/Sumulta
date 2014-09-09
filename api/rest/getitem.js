'use strict';

var mongoose = require('mongoose')
var log      = require('winston');

// Module 'getitem' gets one item

module.exports = function(model, param)
{
    var Model = mongoose.model(model);
    var selector = {};

    return function(req, res, next)
    {
        var id = req.params[param];
        selector[param] = val;
        Model.findOne(selector, {_id:0, __v:0}, function(err, item)
        {
            if(err) return next(err)
            if(item)
            {
                log.info(model + ' found');
                res.json({result: 'found', item:item});
            }
            else
            {
                log.warn(model + ' not found');
                res.statusCode = 404;
                res.json({result: false});
            }
        });
    };
};