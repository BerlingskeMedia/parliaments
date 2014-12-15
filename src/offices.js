/*jshint node: true */

"use strict";

var rds = require('./rds_client');

/* Offices */

module.exports.register = function (plugin, options, next) {

  plugin.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {

      var sql = 'SELECT id, name, sort FROM offices ORDER BY sort ASC, name, ASC';

      rds.query(sql, function (err, offices) {
        if (err) reply().code(500);
        else reply(offices.map(function (office) { return { office: office } } ));
      });
    }
  });

  plugin.route({
    method: 'GET',
    path: '/{id}',
    handler: function (request, reply) {

      var sql = [
        'SELECT candidates.id, candidates.name, candidates.image, count(nominations.id) AS score',
        'FROM candidates',
        'LEFT JOIN nominations ON candidates.id = nominations.candidate_id AND nominations.office_id = ' + rds.escape(request.params.id),
        'GROUP BY candidates.id',
        'ORDER BY score DESC'].join(' ');

      rds.query(sql, function (err, office_nominations) {
        if (err) reply().code(500);
        else reply(office_nominations);
      });
    }
  });

  plugin.route({
    method: 'POST',
    path: '/{id}',
    handler: function (request, reply) {

      var input = request.mime === 'application/json' ?
        request.payload :
        JSON.parse(request.payload); /* in case the Content-Type header has been forgotten */

      var data = {
        id: request.params.id
      }

      if (input.name) {
        data.name = input.name;
      }

      if (input.sort) {
        data.sort = input.sort;
      }

      rds.update('offices', data, function (err, result) {
        if (err) reply().code(500);
        else reply();
      });
    }
  });

};

module.exports.register.attributes = {
    name: 'offices',
    version: '1.0.0'
};
