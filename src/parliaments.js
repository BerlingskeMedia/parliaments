/*jshint node: true */

'use strict';

var rds = require('./rds_client');

/* Parliaments */

module.exports.register = function (plugin, options, next) {

  plugin.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
      reply.file(__dirname + '/testdata/parliaments.json');
    }
  });

  plugin.route({
    method: 'POST',
    path: '/',
    handler: function (request, reply) {
      reply({ uuid: generateUUID() });
    }
  });

  plugin.route({
    method: 'GET',
    path: '/{uuid}',
    handler: function (request, reply) {
      reply().code(501);
    }
  });

};


module.exports.register.attributes = {
    name: 'parliaments',
    version: '1.0.0'
};


function generateUUID(){
  var d = new Date().getTime();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = (d + Math.random()*16)%16 | 0;
    d = Math.floor(d/16);
    return (c=='x' ? r : (r&0x3|0x8)).toString(16);
  });
};