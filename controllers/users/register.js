'use strict';

var User = require('mongoose').model('user');
var hash = require('./hash');
var log  = require('winston');

module.exports = function(req, res, next)
{ 
    var username, pass;
    if(req.body) {username = req.body.username; pass = req.body.password;}
    if(!username || username == '' || !pass || pass == '')
    {
        var message = 'Cannot register: username or password is empty';
        log.warn(message);
        res.statusCode = 400;
        res.json({result: 'error', message: message});
        return;
    }
    log.info("Register user:", username);

    User.findOne({username: username}, function(err, user)
    {
        if(err) return next(err);
        if(user)
        {
            log.warn('User exists');
            res.json({result: 'exists'});
        }
        else
        {
            user = new User({username: username, hash: hash(username, pass)});
            user.save(function(err)
            {
                if(err) return next(err);
                req.login(user, function(err)
                {
                    if(err) return next(err);
                    res.json({result:'registered'});
                }) 
            });
        }
    });
};