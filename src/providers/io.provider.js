const io = require('socket.io');


function ioProvider(http, callback = () => {}) {
  const _io = io(http);

  _io.on("connection", (socket) => {
    // DO: Status = online

    socket.on("disconnect", () => {
      // DO: Status = offline
    });
  })
}

module.exports = ioProvider;
