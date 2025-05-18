const Order = require("../../models/order.model");
const User = require("../../models/user.model");
const ProductVariant = require("../../models/productVariant.model");
const AppError = require("../../helpers/appError.helper");
const stripe = require("../../libs/stripe");

class OrderService {
  static handleCreateOrder = async ({
    user,
    variants,
    totalAmount,
    shippingAddress,
    paymentMethod,
  }) => {
    if (!variants || !variants.length) {
      throw new AppError("Product variants are required", 400);
    }
    const order = await Order.create({
      user,
      variants,
      totalAmount,
      shippingAddress,
      paymentMethod,
    });

    const savedOrder = await order.save();
    if (!savedOrder) {
      throw new AppError("Failed to create order", 400);
    }

    await User.updateOne(
      {
        _id: user._id,
      },
      {
        $push: { orderHistory: savedOrder._id },
      }
    );

    return savedOrder;
  };

  static handleGetOrderUser = async (id) => {
    const orders = await Order.find({ user: id })
      .populate({
        path: "user",
        select: "name",
      })
      .populate({
        path: "variants.variant",
        select: "name color colorName colorCode storage price stock images",
      })
      .lean();

    if (!orders.length) {
      throw new AppError("No orders found", 404);
    }
    return orders;
  };

  static handleCancelOrder = async (orderId) => {
    const order = await Order.findById(orderId);
    if (!order) {
      throw new AppError("Order not found", 404);
    }
    if (order.status !== "pending" && order.status !== "processing") {
      throw new AppError("Order cannot be cancelled", 400);
    }
    for (const item of order.variants) {
      const variant = await ProductVariant.findById(item.variant._id);
      if (variant) {
        variant.stock_quantity += item.quantity;
        await variant.save();
      }
    }

    order.status = "cancel";
    const savedOrder = await order.save();
    return { message: "Order cancelled successfully", savedOrder };
  };

  static handleUpdateOrderPayment = async (sessionId, orderId) => {
    if (!sessionId || !orderId) {
      throw new AppError("Missing sessionId or orderId", 400);
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (!session || session.payment_status !== "paid") {
      throw new AppError("Payment not successful", 400);
    }

    const order = await Order.findById(orderId).populate("variants.variant");
    if (!order) {
      throw new AppError("Order not found", 404);
    }

    for (const item of order.variants) {
      const variant = item.variant;
      if (variant && typeof variant.save === "function") {
        variant.stock_quantity -= item.quantity;
        await variant.save();
      }
    }

    order.status = "processing";
    order.stripeSessionId = session.id;
    const updatedOrder = await order.save();

    return { message: "Order updated successfully", updatedOrder };
  };
}

module.exports = OrderService;
