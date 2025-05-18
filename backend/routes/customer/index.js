const router = require("express").Router();

const authRoutes = require("./auth.route");
const productRoutes = require("./product.route");
const ordersRoutes = require("./order.route");
const promotionRoutes = require("./promotion.route");
const reviewRoutes = require("./review.route");
const paymentRoutes = require("./payment.route");
const provinceRoutes = require("./province.route");
const shippingRoutes = require("./shipping.route");
const pointRoutes = require("./point.route");
const recommendationRoutes = require("./recommendation.route");
const chatbotRoute = require("./chatbot.route");

router.use("/auth", authRoutes);
router.use("/products", productRoutes);
router.use("/orders", ordersRoutes);
router.use("/promotions", promotionRoutes);
router.use("/reviews", reviewRoutes);
router.use("/payment", paymentRoutes);
router.use("/shipping", shippingRoutes);
router.use("/points", pointRoutes);
router.use("/recommendations", recommendationRoutes);
router.use("/chatbot", chatbotRoute);
router.use("/", provinceRoutes);

module.exports = router;
