const PointService = require("../../services/customer/point.service");
const PointVoucher = require("../../models/pointVoucher.model");
const AppError = require("../../helpers/appError.helper");

const getCustomerPoints = async (req, res, next) => {
  try {
    const points = await PointService.getCustomerPoints(req.user._id);
    res.status(200).json({
      message: "Customer points retrieved successfully",
      data: { points },
    });
  } catch (error) {
    next(error);
  }
};

const exchangePointsForVoucher = async (req, res, next) => {
  try {
    const { pointsToUse } = req.body;

    if (!pointsToUse) {
      throw new AppError("Points amount is required", 400);
    }

    const voucher = await PointService.exchangePointsForVoucher(
      req.user._id,
      pointsToUse
    );

    res.status(200).json({
      message: "Points exchanged for voucher successfully",
      data: voucher,
    });
  } catch (error) {
    next(error);
  }
};

const getCustomerVouchers = async (req, res, next) => {
  try {
    const vouchers = await PointVoucher.find({
      customer: req.user._id,
      status: "unused",
      validTo: { $gte: new Date() },
    });

    res.status(200).json({
      message: "Customer vouchers retrieved successfully",
      data: vouchers,
    });
  } catch (error) {
    next(error);
  }
};

const applyVoucher = async (req, res, next) => {
  try {
    const { voucherCode, orderTotal } = req.body;
    const appliedVoucher = await PointService.applyVoucherToOrder(
      voucherCode,
      req.user._id,
      orderTotal
    );
    res.status(200).json({
      message: "Applied voucher successfully",
      data: appliedVoucher,
    });
  } catch (error) {
    next(error);
  }
};

const updateVoucherAsUsed = async (req, res, next) => {
  try {
    const { voucherId, orderId } = req.body;
    const markUsed = await PointService.markVoucherAsUsed(voucherId, orderId);
    res.status(200).json({
      message: "Updated voucher status successfully",
      data: markUsed,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCustomerPoints,
  exchangePointsForVoucher,
  getCustomerVouchers,
  applyVoucher,
  updateVoucherAsUsed,
};
