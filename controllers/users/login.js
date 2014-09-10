'use strict';

var passport = require('passport');

module.exports = function(req, res, next)
{
    passport.authenticate('local', function(err, user, info)
    {
        if(err) return next(err);
        if(user) req.logIn(user, function(err)
        {
            if(err) return next(err);
            res.json({result: 'authorized'});
        });
        else
        {
            res.statusCode = 400;
            res.json({result: false});
        }
    })(req, res, next);
};