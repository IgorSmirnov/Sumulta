'use strict';

var mongoose = require('mongoose');

var newSchema = new mongoose.Schema(
{
    title: 
    {
        type: String,
        unique: false,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    owner: {
        type: String,
        required: true
    }
});

mongoose.model('new', newSchema);
