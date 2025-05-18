const express = require("express");
const router = express.Router();
const messageController = require("../controllers/message.controller");
const { verifyToken } = require("../middleware/auth.middleware");

router.post("/", verifyToken, messageController.createMessage);
router.get("/", verifyToken, messageController.getMessages);

module.exports = router;
