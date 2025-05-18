const router = require("express").Router();
const {
  createCheckoutSession,
  createMomoPayment,
  handleMomoCallback,
  transactionStatus,
} = require("../../controllers/customer/payment.controller");
const { verifyToken } = require("../../middleware/auth.middleware");

// Stripe payment routes
router.post("/create-checkout-session", verifyToken, createCheckoutSession);

// MoMo payment routes
router.post("/momo/create", verifyToken, createMomoPayment);
router.post("/momo/callback", handleMomoCallback);
router.post("/momo/transaction-status", transactionStatus);
module.exports = router;
