const express = require("express");
const router = express.Router();
const authenticateToken = require("../../middleware/auth.middleware");
const chatController = require("../controllers/chat.controller");

router.post("/send", authenticateToken.verifyToken, chatController.sendMessage);

router.get(
  "/messages",
  authenticateToken.verifyToken,
  chatController.getMessages
);

module.exports = router;
