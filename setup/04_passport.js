'use strict';

var passport 		= require('passport');
var LocalStrategy 	= require('passport-local');
var User			= require('mongoose').model('user');
var hash 			= require('../controllers/users/hash');
var log             = require('winston');

passport.use(new LocalStrategy(
	//{usernameField: 'username', passwordField: 'password'},
	function(username, password, done)
    {
        log.info('User ' + username + ' try to login');
        User.findOne({username: username}, function(err, user)
        {
        	if(err) return done(err);
        	if(user && user.hash === hash(username, password)) 
        	{
        		log.info('User ' + username + ' authorized');
        		return done(null, user);
        	}
        	log.warn('Incorrect username or password');
        	return done(null, false, {message: "incorrect username or password"});
        });
	}));

passport.serializeUser(function(user, done) 
{
    done(null, user.id);
});


passport.deserializeUser(function(id, done) 
{
  	User.findById(id, function(err, user)
  	{
    	err ? done(err) : done(null, user);
  	});
});