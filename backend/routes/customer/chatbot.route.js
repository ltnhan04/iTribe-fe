const express = require("express");
const router = express.Router();
const ChatbotController = require("../../controllers/customer/chatbot.controller");
const { verifyToken } = require("../../middleware/auth.middleware");

// Create a new chat session
router.post("/session", verifyToken, ChatbotController.createSession);

// Handle chat messages
router.post("/message", verifyToken, ChatbotController.handleMessage);

// Get chat history
router.get("/history/:sessionId", verifyToken, ChatbotController.getChatHistory);

module.exports = router; 