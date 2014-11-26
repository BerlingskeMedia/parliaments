'use strict';

var mysql = require('mysql');

var pool = mysql.createPool({
  host: process.env.RDS_HOSTNAME,
  port: process.env.RDS_PORT ? process.env.RDS_PORT : null,
  user: process.env.RDS_USERNAME,
  password: process.env.RDS_PASSWORD,
  database: process.env.RDS_DATABASE ? process.env.RDS_DATABASE : null 
});

// Testing we can connect to database
console.log('Connecting to ' + process.env.RDS_HOSTNAME +' as ' + process.env.RDS_USERNAME + '...');
pool.getConnection(function(err, connection) {
  if (err) {
    console.log('Connection to RDS failed: ', err);
    if (err.code === 'ECONNREFUSED') {
      console.log('Maybe the ENV config is missing.');
    }
    process.exit(1);
  } else {
    connection.release();
  }
});

module.exports = pool;


module.exports.queryOne = function (sql, callback) {
  pool.query(sql, function (err, result) {
    if (err) throw err;
    else if (result.length === 0)
      callback(null, null);
    else if (result.length > 1)
      callback(new Error('Too many results'));
    else
      callback(null, result[0]);
  });
};


module.exports.update = function (tableName, data, callback) {

  if (data.id === undefined) {
    callback('Field id missing.');
  }

  var sql = updateSqlString(tableName, data);
  pool.query(sql, callback);
};



function updateSqlString (tableName, data) {
  var pairs = [];
  for (var column in data) {
    if (column !== 'id')
      pairs.push(column + '=' + pool.escape(data[column]));
  }

  return 'UPDATE ' + tableName + ' SET ' + pairs.join(',') + ' WHERE id = ' + data.id;
}
