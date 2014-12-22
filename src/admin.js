/*jshint node: true */

"use strict";


module.exports.register = function (plugin, options, next) {

  plugin.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
      directory: {
        path: 'src/admin',
        index: false
      }
    }
  });

  next();
};

module.exports.register.attributes = {
    name: 'admin',
    version: '1.0.0'
};