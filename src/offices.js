/*jshint node: true */

'use strict';

var rds = require('./rds_client');

/* Offices */

module.exports.register = function (plugin, options, next) {

  plugin.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
      var sql = 'SELECT id, name, sort FROM offices ORDER BY sort ASC';

      rds.query(sql, function (err, offices) {
        if (err) reply().code(500);
        else reply(offices);
      });
    }
  });

  plugin.route({
    method: 'GET',
    path: '/{id}',
    handler: function (request, reply) {
      var office_id = request.params.id;
      var sql = [
        'SELECT candidates.id, candidates.name, count(nominations.id) AS score',
        'FROM candidates',
        'LEFT JOIN nominations ON candidates.id = nominations.candidate_id AND nominations.office_id = ' + office_id,
        'GROUP BY candidates.id',
        'ORDER BY score DESC'].join(' ');

      rds.query(sql, function (err, office_nominations) {
        if (err) reply().code(500);
        else reply(office_nominations);
      });
    }
  });

};

module.exports.register.attributes = {
    name: 'offices',
    version: '1.0.0'
};
