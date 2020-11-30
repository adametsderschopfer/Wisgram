const mysql = require('mysql2');
const { mysqlConnectConfig } = require('./config');

const connection = mysql.createPool(mysqlConnectConfig);

function query(_query, values) {
  return new Promise((resolve, reject) => {
    connection.query(_query, values, (err, result) => {
      if (err) {
        return reject(err);
      }

      resolve(result);
    });
  });
}

module.exports = { connection, query };
