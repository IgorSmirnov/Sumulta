'use strict';

var mongoose = require('mongoose');

var projectSchema = new mongoose.Schema(
{
    name: 
    {
        type: String,
        unique: true,
        required: true
    },
    owner: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
});

mongoose.model('project', projectSchema);
