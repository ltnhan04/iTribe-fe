const Message = require("../models/message.model");

exports.createMessage = async (req, res, next) => {
  try {
    const { sender_id, receive_id, text, image } = req.body;
    const message = await Message.create({
      sender_id,
      receive_id,
      text,
      image,
    });
    res.status(201).json(message);
  } catch (error) {
    next(error);
  }
};

exports.getMessages = async (req, res, next) => {
  try {
    const { sender_id, receive_id } = req.query;
    const messages = await Message.find({
      $or: [
        { sender_id, receive_id },
        { sender_id: receive_id, receive_id: sender_id },
      ],
    }).sort({ createdAt: 1 });
    res.status(200).json(messages);
  } catch (error) {
    next(error);
  }
};
