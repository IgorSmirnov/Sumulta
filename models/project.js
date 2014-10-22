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
    desc:
    {
        type: String,
        required: false
    },
    owner: {
        type: String,
        required: true
    },
    data: {
        type: Object,
        required: true
    },
});

mongoose.model('project', projectSchema);
