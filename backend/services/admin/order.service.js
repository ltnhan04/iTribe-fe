const Order = require("../../models/order.model");
const PointService = require("../customer/point.service");
const AppError = require("../../helpers/appError.helper");
const { sendOrderConfirmationEmail } = require("../nodemailer/email.service");

class OrderService {
  static handleGetOrders = async () => {
    const orders = await Order.find()
      .populate({
        path: "user",
        select: "name email phoneNumber address ",
        match: { _id: { $ne: null } },
      })
      .populate("variants.variant", "name color storage images");
    if (!orders) {
      throw new AppError("No orders found", 404);
    }
    return orders;
  };

  static handleGetOrderDetail = async (orderId) => {
    const order = await Order.findById(orderId)
      .populate({ path: "user", select: "name email phoneNumber address" })
      .populate("variants.variant", "name color storage images");
    if (!order) {
      throw new AppError("Order not found", 404);
    }
    return order;
  };

  static handleUpdateOrderStatus = async (orderId, status) => {
    const validStatuses = [
      "pending",
      "processing",
      "shipped",
      "delivered",
      "cancel",
    ];

    if (!validStatuses.includes(status)) {
      throw new AppError("Invalid status", 400);
    }
    const order = await Order.findById(orderId)
      .populate({ path: "user", select: "name email phoneNumber address" })
      .populate("variants.variant");
    if (!order) {
      throw new AppError("Order not found", 404);
    }
    const currentStatus = order.status;
    if (["delivered", "cancel"].includes(currentStatus)) {
      throw new AppError(
        "Order cannot be updated from its current status",
        400
      );
    }
    const validTransitions = {
      pending: ["processing", "cancel"],
      processing: ["shipped", "cancel"],
      shipped: ["delivered"],
    };
    if (!validTransitions[currentStatus].includes(status)) {
      throw new AppError(
        `Cannot change status from ${currentStatus} to ${status}`,
        400
      );
    }
    if (currentStatus === "pending" && status === "processing") {
      for (const item of order.variants) {
        const productVariant = item.variant;
        if (!productVariant) continue;
        const newStock = productVariant.stock - item.quantity;
        if (newStock < 0) {
          throw new AppError(
            `Insufficient stock for product ${productVariant.name}`,
            400
          );
        }
        productVariant.stock = newStock;
        await productVariant.save();
      }
    }
    if (status === "cancel") {
      for (const item of order.variants) {
        const productVariant = item.variant;
        if (!productVariant) continue;
        productVariant.stock += item.quantity;
        await productVariant.save();
      }
    }
    if (status === "delivered") {
      await sendOrderConfirmationEmail(order, order.user);
      await PointService.addPointsForOrder(order);
    }
    order.status = status;
    const savedOrder = await order.save();
    if (!savedOrder) {
      throw new AppError("Failed to update order status", 400);
    }
    return savedOrder;
  };
}

module.exports = OrderService;
