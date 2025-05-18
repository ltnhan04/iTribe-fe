const express = require("express");
const router = express.Router();
const shippingController = require("../../controllers/customer/shipping.controller");
const { verifyToken } = require("../../middleware/auth.middleware");

router.get("/methods", verifyToken, shippingController.getShippingMethods);
router.post(
  "/calculate-fee",
  verifyToken,
  shippingController.calculateShippingFee
);

module.exports = router;
