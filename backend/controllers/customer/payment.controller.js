const PaymentService = require("../../services/customer/payment.service");

const createCheckoutSession = async (req, res, next) => {
  try {
    const { variants, orderId } = req.body;

    const session = await PaymentService.handleCheckoutSession(
      variants,
      orderId
    );
    res.status(200).json({ url: session.url });
  } catch (error) {
    next(error);
  }
};

const createMomoPayment = async (req, res, next) => {
  try {
    const { orderId, amount, orderInfo } = req.body;

    const paymentUrl = await PaymentService.createMomoPayment(
      orderId,
      amount,
      orderInfo
    );

    res.status(200).json({ url: paymentUrl });
  } catch (error) {
    next(error);
  }
};

const handleMomoCallback = async (req, res, next) => {
  try {
    const result = await PaymentService.handleMomoCallback(req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const transactionStatus = async (req, res, next) => {
  try {
    const { orderId } = req.body;
    const result = await PaymentService.transactionStatus(orderId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCheckoutSession,
  createMomoPayment,
  handleMomoCallback,
  transactionStatus,
};
