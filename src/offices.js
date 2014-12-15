/*jshint node: true */

"use strict";

var rds = require('./rds_client');

/* Offices */

module.exports.register = function (plugin, options, next) {

  /* Returning all offices without any candidates. */
  plugin.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {

      var sql = 'SELECT id, name, sort FROM offices ORDER BY sort ASC, name ASC';

      rds.query(sql, function (err, offices) {
        if (err) {
          console.log(err);
          reply().code(500);
        } else {
          reply(offices.map(function (office) { return { office: office } } ));
        }
      });
    }
  });

  /* Finding all candidates sorted by most nominatied by given office. */
  plugin.route({
    method: 'GET',
    path: '/{id}',
    handler: function (request, reply) {

      var sql = [
        'SELECT candidates.id, candidates.name, candidates.image, count(nominations.id) AS score',
        'FROM candidates',
        'LEFT JOIN nominations ON candidates.id = nominations.candidate_id AND nominations.office_id = ' + rds.escape(request.params.id),
        'WHERE candidates.hidden = 0',
        'GROUP BY candidates.id',
        'ORDER BY score DESC'].join(' ');

      rds.query(sql, function (err, office_nominations) {
        if (err) {
          console.log(err);
          reply().code(500);
        } else {
          reply(office_nominations);
        }
      });
    }
  });


  /* Updates data about the given office. */
  plugin.route({
    method: 'POST',
    path: '/',
    handler: function (request, reply) {

      var data = {},
          input = request.mime === 'application/json' ?
            request.payload.office :
            JSON.parse(request.payload).office; /* in case the Content-Type header has been forgotten */

      if (input.id !== undefined) {
        data.id = input.id;
      } else {
        return reply().code(400);
      }

      if (input.name !== undefined) {
        data.name = input.name;
      }

      if (input.sort !== undefined) {
        data.sort = input.sort;
      }

      console.log('updating office', data);

      rds.update('offices', data, function (err, result) {
        if (err) {
          console.log(err);
          reply().code(500);
        } else {
          reply();
        }
      });
    }
  });

};

module.exports.register.attributes = {
    name: 'offices',
    version: '1.0.0'
};
