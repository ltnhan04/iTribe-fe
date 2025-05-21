import { io, Socket } from "socket.io-client";

const socket: Socket = io({
  transports: ["websocket"],
});

export default socket;
