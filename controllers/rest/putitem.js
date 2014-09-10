'use strict';

//Dependencies

var mongoose = require('mongoose');
var log      = require('winston');

module.exports = function(model, param)
{
    var Model = mongoose.model(model);
    var selector = {};
    return function(req, res, next)
    {
        var body = req.body;
        var p = req.params[param];
        body[param] = p;
        selector[param] = p;
        Model.findOneAndUpdate(selector, body, {upsert: true, new: false}, function(err, item)
        {
            if(err) return next(err);
            var result = item ? 'updated' : 'inserted';
            log.info(model, result);
            res.json({result: result});
        });
    };
};