/*jshint node: true */

"use strict";

var rds = require('./rds_client');

/* Candidates */

module.exports.register = function (plugin, options, next) {

  plugin.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {

      var sql = 'SELECT id, name, image FROM candidates';

      rds.query(sql, function (err, candidates) {
        if (err) reply().code(500);
        else reply(candidates);
      });
    }
  });

  plugin.route({
    method: 'GET',
    path: '/{id}',
    handler: function (request, reply) {

      var sql = 'SELECT id, name, image FROM candidates WHERE id = ' + rds.escape(request.params.id);

      rds.query(sql, function (err, candidate) {
        if (err)
          reply().code(500);
        else if (candidate.length !== 1)
          reply().code(404);
        else
          reply(candidate[0]);
      });
    }
  });

  plugin.route({
    method: 'DELETE',
    path: '/{id}',
    handler: function (request, reply) {

      var sql = 'DELETE FROM candidates WHERE id = ' + rds.escape(request.params.id);
      rds.query(sql, function (err, result) {
        if (err) reply().code(500);
        else reply().code(204);
      });

      // If we should delete all the parliaments with this candidate, we should do the following:
      // SELECT parliament_id FROM nominations WHERE candidate_id = ' + rds.escape(request.params.id) + '
      // result
      // DELETE FROM nominations WHERE parliament_id = (' + result.join(',') + ')'
      // DELETE FROM parliaments WHERE id = (' + result.join(',') + ')'

      // Or it be done with inline SELECTs

      // var sql = 'DELETE FROM nominations WHERE parliament_id = (SELECT id FROM parliaments WHERE id = (SELECT parliament_id FROM nominations WHERE candidate_id = ' + rds.escape(request.params.id) + '))';

      // var sql = 'DELETE FROM parliaments WHERE id = (SELECT parliament_id FROM nominations WHERE candidate_id = ' + rds.escape(request.params.id) + ')';

    }
  });
};

module.exports.register.attributes = {
    name: 'candidates',
    version: '1.0.0'
};
