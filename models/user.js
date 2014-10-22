'use strict';

var mongoose = require('mongoose');

var userSchema = new mongoose.Schema(
{
  	name: 
  	{
    	type: String,
    	unique: true,
    	required: true
  	},
  	hash: 
  	{
    	type: String,
    	required: true
  	},
  	rights: 
  	{
  		type: String
  	}
});

mongoose.model('user', userSchema);
