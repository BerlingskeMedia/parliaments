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
      reply('OK');
    }
  });

  plugin.route({
    method: 'GET',
    path: '/{id}',
    handler: function (request, reply) {
      reply.file(__dirname + '/testdata/parliaments_' + request.params.id + '.json');
    }
  });

};

module.exports.register.attributes = {
    name: 'parliaments',
    version: '1.0.0'
};
