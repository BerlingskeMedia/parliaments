/*jshint node: true */

'use strict';

var rds = require('./rds_client');

/* Offices */

module.exports.register = function (plugin, options, next) {

  plugin.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
      reply.file(__dirname + '/testdata/offices.json');
    }
  });

  plugin.route({
    method: 'GET',
    path: '/{id}',
    handler: function (request, reply) {
      reply.file(__dirname + '/testdata/offices_' + request.params.id + '.json');
    }
  });

};

module.exports.register.attributes = {
    name: 'offices',
    version: '1.0.0'
};
