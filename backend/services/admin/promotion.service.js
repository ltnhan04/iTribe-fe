const Promotion = require("../../models/promotion.model");
const AppError = require("../../helpers/appError.helper");

class PromotionService {
  static handleCreatePromotion = async (
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
  ) => {
    const existingPromotion = await Promotion.findOne({ code });
    if (existingPromotion) {
      throw new AppError("Promotion code already exists", 400);
    }

    const newPromotion = new Promotion({
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
      is_active: true
    });

    const savedPromotion = await newPromotion.save();
    return savedPromotion;
  };

  static handleUpdatePromotion = async (id, updates) => {
    const promotion = await Promotion.findByIdAndUpdate(id, updates, {
      new: true,
    });

    if (!promotion) {
      throw new AppError("Promotion not found", 404);
    }
    return promotion;
  };

  static handleGetPromotions = async () => {
    const promotions = await Promotion.find({})
      .populate('applicable_category', 'name')
      .populate('applicable_products', 'name variant_name price');
    return promotions;
  };

  static handleDeletePromotion = async (id) => {
    const promotion = await Promotion.findByIdAndDelete(id);
    if (!promotion) {
      throw new AppError("Promotion not found", 404);
    }
    return promotion;
  };
}

module.exports = PromotionService;
