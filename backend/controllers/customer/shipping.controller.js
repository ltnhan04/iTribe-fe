const ShippingService = require("../../services/customer/shipping.service");
const AppError = require("../../helpers/appError.helper");

const getShippingMethods = async (req, res, next) => {
  try {
    const { province } = req.query;

    if (!province) {
      throw new AppError("Province is required", 400);
    }

    const methods = await ShippingService.getShippingMethods(province.replace(/"/g, ''));
    res.status(200).json({
      message: "Shipping methods retrieved successfully",
      data: methods,
    });
  } catch (error) {
    next(error);
  }
};

const calculateShippingFee = async (req, res, next) => {
  try {
    const { methodId, province } = req.body;

    if (!methodId || !province) {
      throw new AppError("Method ID and province are required", 400);
    }

    const fee = await ShippingService.calculateShippingFee(methodId, province.replace(/"/g, ''));
    res.status(200).json({
      message: "Shipping fee calculated successfully",
      data: { fee },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getShippingMethods,
  calculateShippingFee,
};
