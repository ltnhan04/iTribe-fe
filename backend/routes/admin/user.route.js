const express = require("express");
const {
  getAllUser,
  getUserDetail,
} = require("../../controllers/admin/user.controller");
const { verifyAdmin } = require("../../middleware/auth.middleware");

const router = express.Router();

router.get("/", verifyAdmin, getAllUser);
router.get("/:userId", verifyAdmin, getUserDetail);
module.exports = router;
