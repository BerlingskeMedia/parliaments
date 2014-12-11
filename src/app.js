/*jshint node: true */

"use strict";


var Hapi = require('hapi'),
    parliaments = require('./parliaments'),
    offices = require('./offices'),
    candidates = require('./candidates'),
    admin = require('./admin');


var server = new Hapi.Server(8080, {
  router: {
    stripTrailingSlash: false
  },
  cors: true
});


server.pack.register(parliaments, { route: { prefix: '/parliaments' } }, function (err) {
  if (err) {
    console.log('Error when loading parliaments plugin', err);
    server.stop();
  }
});


server.pack.register(offices, { route: { prefix: '/offices' } }, function (err) {
  if (err) {
    console.log('Error when loading offices plugin', err);
    server.stop();
  }
});

server.pack.register(candidates, { route: { prefix: '/candidates' } }, function (err) {
  if (err) {
    console.log('Error when loading candidates plugin', err);
    server.stop();
  }
});

server.pack.register(admin, { route: { prefix: '/admin' } }, function (err) {
  if (err) {
    console.log('Error when loading admin plugin', err);
    server.stop();
  }
});


if (!module.parent) {
  server.start(function() {
    console.log("Server started.");
  });
}

module.exports = server;
