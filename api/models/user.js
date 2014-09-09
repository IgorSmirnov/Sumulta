'use strict';

var mongoose       = require('mongoose');

var userSchema = new mongoose.Schema(
{
  	username: 
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
  		type: Array
  	}
});

mongoose.model('user', userSchema);
