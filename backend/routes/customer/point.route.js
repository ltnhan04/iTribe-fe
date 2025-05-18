const express = require("express");
const router = express.Router();
const pointController = require("../../controllers/customer/point.controller");
const { verifyToken } = require("../../middleware/auth.middleware");

router.get("/", verifyToken, pointController.getCustomerPoints);
router.get("/vouchers", verifyToken, pointController.getCustomerVouchers);
router.post(
  "/exchange-voucher",
  verifyToken,
  pointController.exchangePointsForVoucher
);
router.post("/apply", verifyToken, pointController.applyVoucher);
router.put("/status", verifyToken, pointController.updateVoucherAsUsed);
module.exports = router;
