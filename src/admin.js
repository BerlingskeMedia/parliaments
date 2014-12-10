'use strict';


module.exports.register = function (plugin, options, next) {

  plugin.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
      directory: {
        path: 'src/admin',
        index: true
      }
    }
  });

  next();
};

module.exports.register.attributes = {
    name: 'admin',
    version: '1.0.0'
};