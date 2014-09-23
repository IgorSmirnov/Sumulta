'use strict';

//Dependencies

var mongoose = require('mongoose');
var log      = require('winston');

module.exports = function(model)
{
    var Model = mongoose.model(model);
    return function(req, res, next)
    {
        var body = req.body;
        Model.findOneAndUpdate(req.params, body, {upsert: true, new: false}, function(err, item)
        {
            if(err) return next(err);
            var result = item ? 'updated' : 'inserted';
            log.info(model, result);
            res.json({result: result});
        });
    };
};