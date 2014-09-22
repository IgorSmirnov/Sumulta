'use strict';

var mongoose = require('mongoose');

var logSchema = new mongoose.Schema(
{
    timestamp: 
    {
        type: Date,
        required: true
    },
    level: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    }
});

mongoose.model('log', logSchema);
