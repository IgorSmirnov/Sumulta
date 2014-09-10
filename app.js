'use strict';

var express        = require('express');
var bodyParser     = require('body-parser');
var cookieParser   = require('cookie-parser');
var session        = require('express-session');
var passport       = require('passport');
var config		   = require('nconf');
var requireTree    = require('require-tree');
var log			   = require('winston');

requireTree('./setup/');

var app = express();

app.set('views', './views');
app.set('view engine', 'jade');


app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({secret: 'secret', resave:true, saveUninitialized: true}));

app.use(passport.initialize());
app.use(passport.session());

var routes = requireTree('./routes/');
for(var x in routes) routes[x](app);

var port = config.get('express:port');
app.listen(port, function()
{
	log.info('Application listen port', port);
});
