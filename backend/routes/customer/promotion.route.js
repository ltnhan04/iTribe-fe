const router = require("express").Router();

const {
  applyPromotion,
  getActivePromotions,
} = require("../../controllers/customer/promotion.controller");
const { verifyToken } = require("../../middleware/auth.middleware");

router.post("/apply", verifyToken, applyPromotion);
router.get("/active", verifyToken, getActivePromotions);

module.exports = router;
