const socketIo = require("socket.io");
const socketHandler = require("./socket");
const corsOptions = require("../config/cors");

module.exports = function initSocket(server) {
  const io = socketIo(server, {
    cors: corsOptions,
  });

  socketHandler(io);
};
