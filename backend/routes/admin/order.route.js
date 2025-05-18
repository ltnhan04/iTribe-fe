const router = require("express").Router();
const {
  getAllOrders,
  updateOrderStatus,
  getOrderDetail,
} = require("../../controllers/admin/order.controller");
const { verifyAdmin } = require("../../middleware/auth.middleware");

router.get("/", verifyAdmin, getAllOrders);
router.get("/:orderId", getOrderDetail);
router.put("/:orderId", verifyAdmin, updateOrderStatus);
module.exports = router;
