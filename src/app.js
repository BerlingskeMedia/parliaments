'use strict';


var Hapi = require('hapi'),
    parliaments = require('./parliaments'),
    offices = require('./offices');


var server = new Hapi.Server(8000, {
  router: {
    stripTrailingSlash: false
  },
  cors: true
});


server.pack.register(parliaments, { route: { prefix: '/parliaments' } }, function (err) {
  if (err) {
    console.log('Error when loading parliaments plugin', err);
    pack.stop();
  }
});


server.pack.register(offices, { route: { prefix: '/offices' } }, function (err) {
  if (err) {
    console.log('Error when loading offices plugin', err);
    pack.stop();
  }
});


if (!module.parent) {
  server.start(function() {
    console.log("Server started.");
  });
}

module.exports = server;
