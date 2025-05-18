const router = require("express").Router();
const { verifyAdmin } = require("../../middleware/auth.middleware");

const{
    getAllNotifications
} = require("../../controllers/admin/notification.controller")

router.get("/",verifyAdmin, getAllNotifications)

module.exports = router;
