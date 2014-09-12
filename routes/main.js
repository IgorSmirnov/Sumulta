'use strict';

var express      = require('express');
var config       = require('nconf');
var log          = require('winston');
var requireTree  = require('require-tree');
var controllers  = requireTree('../controllers');
var fs           = require('fs');

module.exports = function(app)
{

    app.get('/', controllers.render('index', {scripts: ['./js/core.js']}));
    app.get('/debug', controllers.render('index', {scripts: controllers.readdir('./js/core/')}));


    app.get('/admin', controllers.render('admin'));
    app.post('/admin/rebuild', controllers.rebuild);

    // Users API
    //app.post  ('/api/register',     require('../users/register'));
    //app.post  ('/api/login',        require('../users/login'));
    //app.post  ('/api/logout',       require('../users/must-auth'), require('../users/logout'));

    // Books API protection
    //app.all   ('/api/books',        require('../users/must-auth'));
    //app.all   ('/api/books/*',      require('../users/must-auth'));

    // Projects API
    app.get   ('/api/projects',       controllers.rest.getlist('project'));
    app.get   ('/api/projects/:name', controllers.rest.getitem('project', 'name'));

    //app.put   ('/api/books',        require('../books/put'));
    app.put   ('/api/projects/:name', controllers.rest.putitem('project', 'name'));
    //app.post  ('/api/books',        require('../books/post'));

    //app.delete('/api/books',        require('../books/delete'));
    //app.delete('/api/books/:id',    require('../book/delete'));


    if(config.get('get_static'))
    {
        app.use('/js/',  express.static("./js/"));
        app.use('/css/', express.static("./css/"));
    }

    app.use(function(req, res, next)
    {
        res.status(404);
        log.debug('URL not found:', req.url);
        res.json({result: 'error', message: 'URL not found'});
    });
    // Server internal error
    app.use(function(err, req, res, next)
    {
        res.status(err.status || 500);
        log.error('Internal error(%d): %s', res.statusCode, err.message);
        res.json({result: 'error', message: err.message});
    });
};
