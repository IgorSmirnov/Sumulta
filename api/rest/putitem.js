'use strict';

//Dependencies

var Book = require('mongoose').model('book');
var log  = require('winston');

// Module 'book/put' updates or inserts one book

module.exports = function(req, res, next)
{
    var body = req.body;
    var id = req.params.id;
    body.id = id;
    Book.findOneAndUpdate({id: id}, body, {upsert: true, new: false}, function(err, book)
    {
        if(err) return next(err);
        var result = book ? 'updated' : 'inserted';
        log.info('Book', result);
        res.json({result: result});
    });
}