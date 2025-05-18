import { io, Socket } from "socket.io-client";

const socket: Socket = io(process.env.NEXT_PUBLIC_API_ENDPOINT as string, {
  transports: ["websocket"],
});

export default socket;
