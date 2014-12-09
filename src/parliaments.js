/*jshint node: true */

'use strict';

var rds = require('./rds_client');

/* Parliaments */

module.exports.register = function (plugin, options, next) {

  plugin.route({
    method: 'POST',
    path: '/',
    handler: function (request, reply) {

      var parliament = request.mime === 'application/json'
        ? request.payload
        : JSON.parse(request.payload), /* in case the Content-Type header has been forgotten */
      uuid = generateUUID();

      insert_parliament(uuid, function (err, result) {
        var parliament_id = result.insertId;

        parliament.nominations.forEach(function (nomination) {

          if (nomination.candidate.id) {
            insert_nomination(parliament_id, nomination.candidate.id, nomination.office.id);

          } else {
           insert_candidate(nomination.candidate.name, function (err, result) {
            insert_nomination(parliament_id, result.insertId, nomination.office.id);
           });
          }
        });
      });

      reply({ uuid: uuid });
    }
  });

  plugin.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
      var sql = [
        'SELECT offices.id office_id, offices.name office_name, candidates.id candidate_id, candidates.name candidate_name, candidates.image candidate_image, max(nomis) score',
        'FROM',
          '(SELECT office_id, candidate_id, COUNT(candidate_id) nomis',
          'FROM nominations',
          'GROUP BY office_id, candidate_id) candidate_nominations',
        'LEFT JOIN offices ON offices.id = candidate_nominations.office_id',
        'LEFT JOIN candidates ON candidates.id = candidate_nominations.candidate_id',
        'GROUP BY office_id',
        'ORDER BY sort ASC'].join(' ');

      rds.query(sql, function (err, result) {
        if (err) reply().code(500);
        else {
          var parliament = result.map(to_parliament);
          reply(parliament);
        }
      });
    }
  });

  plugin.route({
    method: 'GET',
    path: '/{uuid}',
    handler: function (request, reply) {

      var sql = [
        'SELECT offices.id office_id, offices.name office_name, candidates.id candidate_id, candidates.name candidate_name, candidates.image candidate_image',
        'FROM parliaments',
        'LEFT JOIN nominations ON parliaments.id = nominations.parliament_id',
        'LEFT JOIN candidates ON nominations.candidate_id = candidates.id',
        'LEFT JOIN offices ON nominations.office_id = offices.id',
        'WHERE parliaments.uuid = "' + request.params.uuid + '"',
        'ORDER BY sort ASC'].join(' ');

      rds.query(sql, function (err, result) {
        if (err) reply().code(500);
        else {
          var parliament = result.map(to_parliament);
          reply(parliament);
        }
      });
    }
  });

};


module.exports.register.attributes = {
    name: 'parliaments',
    version: '1.0.0'
};


function generateUUID () {
  var d = new Date().getTime();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = (d + Math.random()*16)%16 | 0;
    d = Math.floor(d/16);
    return (c=='x' ? r : (r&0x3|0x8)).toString(16);
  });
}


function insert_parliament (uuid, callback) {
  var sql = 'INSERT INTO parliaments (uuid) VALUES ("' + uuid + '")';
  rds.query(sql, callback);
}


function insert_nomination (parliament_id, candidate_id, office_id, callback) {
  var sql = [
    'INSERT INTO nominations (parliament_id, candidate_id, office_id)',
    'VALUES (',
    [rds.escape(parliament_id), rds.escape(candidate_id), rds.escape(office_id)].join(','),
    ')'].join(' ');
  rds.query(sql, callback);
}


function insert_candidate (name, callback) {
  var sql = 'INSERT INTO candidates (name) VALUES (' + rds.escape(name) + ')';
  rds.query(sql, callback);
}

function to_parliament (result) {
  return {
    office: {
      id: result.office_id,
      name: result.office_name
    },
    candidate: {
      id: result.candidate_id,
      name: result.candidate_name,
      image: result.candidate_image
    }
  };
}