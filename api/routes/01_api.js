'use strict';

module.exports = function(app)
{
    // Users API
    //app.post  ('/api/register',     require('../users/register'));
    //app.post  ('/api/login',        require('../users/login'));
    //app.post  ('/api/logout',       require('../users/must-auth'), require('../users/logout'));

    // Books API protection
    //app.all   ('/api/books',        require('../users/must-auth'));
    //app.all   ('/api/books/*',      require('../users/must-auth'));

    // Projects API
    app.get   ('/api/projects',       require('../rest/getlist')('project'));
    app.get   ('/api/projects/:name', require('../rest/getitem')('project', 'name'));

    //app.put   ('/api/books',        require('../books/put'));
    app.put   ('/api/projects/:name', require('../rest/putitem')('project', 'name'));

    //app.post  ('/api/books',        require('../books/post'));

    //app.delete('/api/books',        require('../books/delete'));
    //app.delete('/api/books/:id',    require('../book/delete'));
}