const mysql = require('mysql2');
const { mysqlConnectConfig } = require('./config');

const connection = mysql.createPool(mysqlConnectConfig);

/**
 * A Query string
 * @typedef {string} QueryString
 */

/**
 *
 * @param {QueryString} _query
 * @param {Array<string | number>} values
 * @return {Promise<Array<string | number | object>>}
 */

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
