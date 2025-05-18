const {
  getMessages,
  sendMessage,
} = require("../../controllers/chat.controller");

class ChatService {
  static handleGetMessages = async () => {
    const messages = await getMessages();
    return messages;
  };
  static handleSendReply = async (userId, message) => {
    const message = await sendMessage(userId, message);
    return message;
  };
}

module.exports = ChatService;
