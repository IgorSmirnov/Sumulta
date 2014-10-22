'use strict';

var log = require('winston');
require('winston-mongodb').MongoDB;

log.add(log.transports.MongoDB, {db: 'sumulta'});



