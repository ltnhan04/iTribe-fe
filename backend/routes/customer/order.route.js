const router = require("express").Router();
const { verifyToken } = require("../../middleware/auth.middleware");
const {
  createOrder,
  getOrdersByUser,
  cancelOrder,
  updateOrderPayment,
} = require("../../controllers/customer/order.controller");

router.post("/", verifyToken, createOrder),
  router.get("/", verifyToken, getOrdersByUser),
  router.put("/:orderId", verifyToken, cancelOrder);
router.post("/update-order-payment", verifyToken, updateOrderPayment);
module.exports = router;
