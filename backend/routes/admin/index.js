const express = require("express");
const router = express.Router();

router.use("/products", require("./product.route"));
router.use("/products/variant", require("./productVariant.route"));
router.use("/users", require("./user.route"));
router.use("/orders", require("./order.route"));
router.use("/reviews", require("./review.route"));
router.use("/promotions", require("./promotion.route"));
router.use("/notifications", require("./notification.route"));
router.use("/categories", require("./category.route"));
router.use("/revenue", require("./revenue.route"));

module.exports = router;
