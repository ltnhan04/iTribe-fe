const PromotionService = require("../../services/customer/promotion.service");

const applyPromotion = async (req, res, next) => {
  try {
    const { code, totalAmount } = req.body;
    const userId = req.user._id; // Lấy userId từ req.user sau khi verify token

    const result = await PromotionService.handleApplyPromotion(
      code,
      totalAmount,
      userId
    );

    res.status(200).json({
      status: "success",
      data: {
        originalAmount: result.originalAmount,
        discountAmount: result.discountAmount,
        finalAmount: result.finalAmount
      },
    });
  } catch (error) {
    next(error);
  }
};

const getActivePromotions = async (req, res, next) => {
  try {
    const userId = req.user._id; // Lấy userId từ req.user sau khi verify token
    const promotions = await PromotionService.handleGetActivePromotions(userId);
    
    res.status(200).json({
      status: "success",
      data: {
        promotions: promotions
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { applyPromotion, getActivePromotions };
