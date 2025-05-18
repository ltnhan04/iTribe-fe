const OrderService = require("../../services/customer/order.service");

const createOrder = async (req, res, next) => {
  try {
    const { variants, totalAmount, shippingAddress, paymentMethod } = req.body;
    const savedOrder = await OrderService.handleCreateOrder({
      user: req.user._id,
      variants,
      totalAmount,
      shippingAddress,
      paymentMethod,
    });

    res
      .status(201)
      .json({ message: "Order created successfully", order: savedOrder });
  } catch (error) {
    next(error);
  }
};

const getOrdersByUser = async (req, res, next) => {
  try {
    const orders = await OrderService.handleGetOrderUser(req.user._id);
    res.status(200).json({ message: "Get orders successfully", orders });
  } catch (error) {
    next(error);
  }
};

const cancelOrder = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { message, savedOrder } = await OrderService.handleCancelOrder(
      orderId
    );
    res.status(200).json({ message, order: savedOrder });
  } catch (error) {
    next(error);
  }
};

const updateOrderPayment = async (req, res, next) => {
  try {
    const { sessionId, orderId } = req.body;
    const { message, updatedOrder } =
      await OrderService.handleUpdateOrderPayment(sessionId, orderId);
    res.status(200).json({
      message,
      data: updatedOrder,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getOrdersByUser,
  cancelOrder,
  updateOrderPayment,
};
