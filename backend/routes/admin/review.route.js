const router = require("express").Router();
const { deleteReview } = require("../../controllers/admin/review.controller");
const { verifyAdmin } = require("../../middleware/auth.middleware");

router.delete("/:id", verifyAdmin, deleteReview);
module.exports = router;
