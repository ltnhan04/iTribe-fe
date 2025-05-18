const router = require("express").Router();
const {
  createPromotion,
  updatePromotion,
  getAllPromotions,
  deletePromotion,
} = require("../../controllers/admin/promotion.controller");
const {verifyAdmin} = require("../../middleware/auth.middleware");

router.post("/", verifyAdmin, createPromotion);
router.put("/:id", verifyAdmin, updatePromotion);
router.get("/", verifyAdmin, getAllPromotions);
router.delete("/:id", verifyAdmin, deletePromotion);
module.exports = router;
