const ioServer = require('socket.io');

function ioProvider(http, callback = () => {}) {
  const io = ioServer(http);

  io.on('connection', socket => {
    // DO: Status = online

    socket.on('disconnect', () => {
      // DO: Status = offline
    });
  });
}

module.exports = ioProvider;
