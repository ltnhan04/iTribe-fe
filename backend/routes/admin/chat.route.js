const express = require('express');
const adminChatController = require('../../controllers/admin/adminChatController');
const adminAuthMiddleware = require('../../middleware/auth.middleware');

const router = express.Router();

router.get('/admin/messages', adminAuthMiddleware.verifyAdmin, adminChatController.getAllMessages);
router.post('admin/reply', adminAuthMiddleware.verifyAdmin, adminChatController.sendReply);

module.exports = router;
