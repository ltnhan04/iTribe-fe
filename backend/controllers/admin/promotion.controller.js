const PromotionService = require("../../services/admin/promotion.service");

const createPromotion = async (req, res, next) => {
  try {
    const {
      code,
      discount_type,
      discount_amount,
      discount_percent,
      valid_from,
      valid_to,
      max_usage,
      max_usage_per_user,
      min_order_amount,
      applicable_category,
      applicable_products,
    } = req.body;

    const savedPromotion = await PromotionService.handleCreatePromotion(
      code,
      discount_type,
      discount_amount,
      discount_percent,
      valid_from,
      valid_to,
      max_usage,
      max_usage_per_user,
      min_order_amount,
      applicable_category,
      applicable_products
    );

    res.status(201).json({
      status: "success",
      data: {
        promotion: savedPromotion,
      },
    });
  } catch (error) {
    next(error);
  }
};

const updatePromotion = async (req, res, next) => {
  try {
    const { id } = req.params;
    const promotion = await PromotionService.handleUpdatePromotion(id, req.body);

    res.status(200).json({
      status: "success",
      data: {
        promotion,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getAllPromotions = async (_, res, next) => {
  try {
    const promotions = await PromotionService.handleGetPromotions();
    res.status(200).json({
      status: "success",
      data: {
        promotions,
      },
    });
  } catch (error) {
    next(error);
  }
};

const deletePromotion = async (req, res, next) => {
  try {
    const { id } = req.params;
    const promotion = await PromotionService.handleDeletePromotion(id);

    res.status(200).json({
      status: "success",
      data: {
        promotion,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPromotion,
  updatePromotion,
  getAllPromotions,
  deletePromotion,
};
