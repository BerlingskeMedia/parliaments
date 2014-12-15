/*jshint node: true */

"use strict";

var rds = require('./rds_client');

/* Candidates */

module.exports.register = function (plugin, options, next) {

  plugin.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {

      var sql = 'SELECT id, name, image, hidden FROM candidates';

      rds.query(sql, function (err, candidates) {
        if (err) {
          console.log(err);
          reply().code(500);
        } else {
          reply(candidates);
        }
      });
    }
  });

  plugin.route({
    method: 'GET',
    path: '/{id}',
    handler: function (request, reply) {

      var sql = 'SELECT id, name, image, hidden FROM candidates WHERE id = ' + rds.escape(request.params.id);

      rds.query(sql, function (err, candidate) {
        if (err) {
          console.log(err);
          reply().code(500);
        }
        else if (candidate.length !== 1)
          reply().code(404);
        else
          reply(candidate[0]);
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

      if (input.name !== undefined) {
        data.name = input.name;
      }

      if (input.image !== undefined) {
        data.image = input.image;
      }

      if (input.hidden !== undefined) {
        data.hidden = input.hidden;
      }

      console.log('updating candidate', data);

      rds.update('candidates', data, function (err, result) {
        if (err) {
          console.log(err);
          reply().code(500);
        } else {
          reply();
        }
      });
    }
  });

  plugin.route({
    method: 'DELETE',
    path: '/{id}',
    handler: function (request, reply) {

      var sql = 'UPDATE candidates SET hidden = 1 WHERE id = ' + rds.escape(request.params.id);

      rds.query(sql, function (err, result) {
        if (err) {
          console.log(err);
          reply().code(500);
        } else {
          reply().code(204);
        }
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
