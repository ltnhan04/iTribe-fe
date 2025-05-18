const router = require("express").Router();
const {
  createReview,
  updateReview,
  deleteReview,
  getReviews,
} = require("../../controllers/customer/review.controller");
const { verifyToken } = require("../../middleware/auth.middleware");

router.get("/", getReviews);
router.post("/", verifyToken, createReview);
router.put("/:id", verifyToken, updateReview);
router.delete("/:id", verifyToken, deleteReview);

module.exports = router;
