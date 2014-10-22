'use strict';

var express      = require('express');
var config       = require('nconf');
var log          = require('winston');
var requireTree  = require('require-tree');
var controllers  = requireTree('../controllers');
var fs           = require('fs');
var passport     = require('passport');

var users        = controllers.users;
var render       = controllers.render;
var rest         = controllers.rest;
var stat         = controllers.stat;

module.exports = function(app)
{
    if(config.get('express:get_static'))
    {
        app.use('/js/',   express.static('./js/'));
        app.use('/css/',  express.static('./css/'));
        app.use('/html/', express.static('./views/'));

        app.use('/admin/test', express.static('./test/client'))
    }
    // Администирование

    //app.get   ('/debug',               render('project', {scripts: controllers.readdir('./js/ui/', './js/lang/ru.js', './js/core/', './js/geom/')}));
    app.get   ('/admin',               render('admin'));
    app.get   ('/admin/log.json',      rest.getlist('log', ['timestamp', 'level', 'message']));

    app.post  ('/admin/rebuild',       controllers.rebuild);


    app.all   ('/api/1/*',              controllers.dump);

    // API 
    app.get   ('/api/1/auth',                users.get_auth);
    app.post  ('/api/1/auth/register',       users.register);
    app.post  ('/api/1/auth/login',          users.login);
    app.post  ('/api/1/auth/logout',         users.must_auth, users.logout);
    app.get   ('/api/1/auth/vk',             passport.authenticate('vkontakte'));
    app.get   ('/api/1/auth/vkcb',           passport.authenticate('vkontakte', {failureRedirect: '/login'}),
        function(req, res) { 
            log.info('success!!!');
            res.redirect('/');});

    // Пользовательские запросы

    app.get   ('/api/1/news',                         rest.getlist('new'));    // Вернуть новости
    app.get   ('/api/1/users',                        rest.getlist('user'));    // Вернуть список пользователей
    app.get   ('/api/1/projects',                     rest.getlist('project', ['name', 'owner']));    // Вернуть список проектов
    app.get   ('/api/1/users/:owner/projects',        rest.getlist('project'));    // Вернуть проекты пользователя
    app.get   ('/api/1/users/:owner/projects/:name',  rest.getitem('project', ['name', 'owner', 'data'])); // Вернуть проект 
    app.put   ('/api/1/users/:owner/projects/:name', users.must_own, rest.putitem('project')); // Сохранить проект 

    // Страницы сайта

    app.get   ('/',                    stat('views/index.html'));//render('head'));    // Главная страница
    app.get   ('/:user',               stat('views/index.html'));//render('user'));    // Cтраница пользователя
  //app.get   ('/:user/:project',      render('project', {scripts: ['./js/core.js']})); // Страница проекта
    app.get   ('/:user/:project',      stat('views/index.html'));//render('project', {
        //scripts: controllers.readdir('./js/lib.js', './js/ui/', './js/lang/ru.js', './js/core/', './js/geom/')}));

    // Projects API
    app.get   ('/api/projects',       controllers.rest.getlist('project'));
    app.get   ('/api/projects/:name', controllers.rest.getitem('project', 'name'));

    //app.put   ('/api/books',        require('../books/put'));
    app.put   ('/api/projects/:name', controllers.rest.putitem('project', 'name'));
    //app.post  ('/api/books',        require('../books/post'));

    //app.delete('/api/books',        require('../books/delete'));
    //app.delete('/api/books/:id',    require('../book/delete'));


    // Ошибки

    app.use(function(req, res, next)
    {
        res.status(404);
        log.debug('URL not found:', req.url);
        res.json({result: 'error', message: 'URL not found'});
    });
    app.use(function(err, req, res, next)
    {
        res.status(err.status || 500);
        log.error('Internal error(%d): %s', res.statusCode, err.message);
        res.json({result: 'error', message: err.message});
    });
};
