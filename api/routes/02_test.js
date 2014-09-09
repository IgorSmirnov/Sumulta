'use strict';

var express = require('express');

module.exports = function(app)
{
    // API test page
    app.use('/test/', express.static("./test/"));
}