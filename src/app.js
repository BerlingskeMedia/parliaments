'use strict';

var Hapi = require('hapi'),
    parliaments = require('./parliaments'),
    offices = require('./offices');


var pack = new Hapi.Pack();

pack.server(8000, {
  router: {
    stripTrailingSlash: false
  }
});

pack.register(parliaments, { route: { prefix: '/parliaments' } }, function (err) {
  if (err) {
    console.log('Error when loading parliaments plugin', err);
    pack.stop();
  }
});

pack.register(offices, { route: { prefix: '/offices' } }, function (err) {
  if (err) {
    console.log('Error when loading offices plugin', err);
    pack.stop();
  }
});


if (!module.parent) {
  pack.start(function() {
    console.log("Pack started.");
  });
}

module.exports = pack;
