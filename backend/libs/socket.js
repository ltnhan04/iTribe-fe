const Message = require("../models/message.model");

module.exports = function socketHandler(io) {
  const userSockets = new Map();

  io.on("connection", (socket) => {
    console.log(`[Socket] Connected: ${socket.id}`);

    socket.on("userConnected", (userId) => {
      userSockets.set(userId, socket.id);
      console.log(`[Socket] User ${userId} connected with socket ${socket.id}`);
    });

    socket.on("sendMessage", async (messageData) => {
      try {
        const message = await Message.create(messageData);
        const receiverSocketId = userSockets.get(messageData.receive_id);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("newMessage", message);
        }

        socket.emit("messageSent", message);
      } catch (error) {
        console.error("[Socket] Error sending message:", error);
        socket.emit("messageError", { error: "Failed to send message" });
      }
    });

    socket.on("disconnect", () => {
      for (const [userId, socketId] of userSockets.entries()) {
        if (socketId === socket.id) {
          userSockets.delete(userId);
          console.log(`[Socket] User ${userId} disconnected`);
          break;
        }
      }
    });
  });
};
