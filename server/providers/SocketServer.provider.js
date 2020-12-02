const socketIo = require('socket.io');
const http = require('http');

/**
 *
 * @param {http.Server} server
 * @return {null}
 */

module.exports = server => {
  const io = socketIo(server);
};
