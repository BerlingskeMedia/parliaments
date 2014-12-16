/*jshint node: true */

"use strict";

var rds = require('./rds_client');

/* Parliaments */

module.exports.register = function (plugin, options, next) {

  plugin.route({
    method: 'POST',
    path: '/',
    handler: function (request, reply) {

      var parliament = request.mime === 'application/json' ?
        request.payload :
        JSON.parse(request.payload); /* in case the Content-Type header has been forgotten */

      if (parliament.nominations === undefined ||  parliament.nominations === null || parliament.nominations.length < 1) {
        return reply().code(400);
      }

      var uuid = generateUUID(),
          sql = 'INSERT INTO parliaments (uuid, created) VALUES (' + rds.escape(uuid) + ', ' + rds.escape(new Date().toISOString()) + ')';

      rds.query(sql, function (err, result) {
        var parliament_id = result.insertId;

        parliament.nominations.forEach(function (nomination) {

          if (nomination.candidate) {
            if (nomination.candidate.id) {
              insert_nomination(parliament_id, nomination.candidate.id, nomination.office.id);

            } else {
              var sql = 'INSERT INTO candidates (name) VALUES (' + rds.escape(nomination.candidate.name) + ')';

              rds.query(sql, function (err, result) {
                insert_nomination(parliament_id, result.insertId, nomination.office.id);
              });
            }
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
        'SELECT *',
        'FROM',
          '(SELECT office_id, offices.name office_name, sort, candidate_id, candidates.name candidate_name, candidates.image candidate_image, COUNT(candidate_id) score',
          'FROM nominations',
          'JOIN candidates ON hidden = 0 AND candidates.id = nominations.candidate_id',
          'LEFT JOIN offices ON offices.id = nominations.office_id',
          'GROUP BY office_id, candidate_id',
          'ORDER BY offices.sort ASC, score DESC) AS candidate_nominations',
        'GROUP BY office_id',
        'HAVING MAX(score)',
        'ORDER BY sort ASC'].join(' ');

      rds.query(sql, function (err, result) {
        if (err) {
          console.log(err);
          reply().code(500);
        } else {
          reply( { nominations: result.map(to_nomination) } );
        }
      });
    }
  });

  // plugin.route({
  //   method: 'GET',
  //   path: '/all',
  //   handler: function (request, reply) {

  //     var sql = [
  //       'SELECT parliaments.id, parliaments.uuid, count(nominations.id) candidates',
  //       'FROM parliaments',
  //       'LEFT JOIN nominations on nominations.parliament_id = parliaments.id',
  //       'GROUP BY parliaments.id'].join(' ');

  //     rds.query(sql, function (err, result) {
  //       if (err) {
  //         console.log(err);
  //         reply().code(500);
  //       } else {
  //         reply(result);
  //       }
  //     });
  //   }
  // });

  plugin.route({
    method: 'GET',
    path: '/count',
    handler: function (request, reply) {

      var sql = 'SELECT count(id) as count FROM parliaments';

      rds.query(sql, function (err, result) {
        if (err) {
          console.log(err);
          reply().code(500);
        } else {
          reply(result[0]);
        }
      });
    }
  });


  plugin.route({
    method: 'POST',
    path: '/{uuid}',
    handler: function (request, reply) {

      var name = request.mime === 'application/json' ?
        request.payload.name :
        JSON.parse(request.payload).name; /* in case the Content-Type header has been forgotten */

      if (name === undefined) {
        return reply().code(400);
      }

      var sql = [
        'UPDATE parliaments',
        'SET name = ' + rds.escape(name),
        'WHERE uuid = ' + rds.escape(request.params.uuid)].join(' ');

      rds.query(sql, function (err, result) {
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
    method: 'GET',
    path: '/{uuid}',
    handler: function (request, reply) {

      var sql = [
        'SELECT parliaments.name parliament_name, offices.id office_id, offices.name office_name, candidates.id candidate_id, candidates.name candidate_name, candidates.image candidate_image',
        'FROM parliaments',
        'LEFT JOIN nominations ON parliaments.id = nominations.parliament_id',
        'LEFT JOIN candidates ON nominations.candidate_id = candidates.id',
        'LEFT JOIN offices ON nominations.office_id = offices.id',
        'WHERE parliaments.uuid = ' + rds.escape(request.params.uuid),
        'ORDER BY sort ASC'].join(' ');

      rds.query(sql, function (err, result) {
        if (err) {
          console.log(err);
          reply().code(500);
        } else if (result.length === 0) {
          reply().code(404);
        } else {
          reply( { name: result[0].parliament_name, nominations: result.map(to_nomination) } );
        }
      });
    }
  });


  // plugin.route({
  //   method: 'DELETE',
  //   path: '/{uuid}',
  //   handler: function (request, reply) {

  //     var sql = 'DELETE FROM nominations WHERE parliament_id = (SELECT id FROM parliaments WHERE uuid = ' + rds.escape(request.params.uuid) + ')';

  //     rds.query(sql, function (err, result) {
  //       if (err) reply().code(500);
  //       else {

  //         var sql = 'DELETE FROM parliaments WHERE uuid = ' + rds.escape(request.params.uuid);

  //         rds.query(sql, function (err, result) {
  //           if (err) reply().code(500);
  //           else reply().code(204);
  //         });
  //       }
  //     });
  //   }
  // });
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


function insert_nomination (parliament_id, candidate_id, office_id, callback) {
  var sql = [
    'INSERT INTO nominations (parliament_id, candidate_id, office_id)',
    'VALUES (',
    [rds.escape(parliament_id), rds.escape(candidate_id), rds.escape(office_id)].join(','),
    ')'].join(' ');
  rds.query(sql, callback);
}


function to_nomination (result) {
  var nomination = {
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

  if (result.score) {
    nomination.score = result.score;
  }
  return nomination;
}