const Promotion = require("../../models/promotion.model");
const AppError = require("../../helpers/appError.helper");
const Order = require("../../models/order.model");

class PromotionService {
  static handleApplyPromotion = async (code, totalAmount, userId) => {
    const promotion = await Promotion.findOne({
      code,
      is_active: true,
      valid_from: { $lte: new Date() },
      valid_to: { $gte: new Date() }
    });

    if (!promotion) {
      throw new AppError("Invalid promotion code", 404);
    }

    if (totalAmount < promotion.min_order_amount) {
      throw new AppError(
        `Order must be at least ${promotion.min_order_amount.toLocaleString()}đ to use this promotion`,
        400
      );
    }

    // Kiểm tra số lần sử dụng của voucher
    if (promotion.used_count >= promotion.max_usage) {
      promotion.is_active = false;
      await promotion.save();
      throw new AppError("Promotion usage limit reached", 400);
    }

    // Kiểm tra số lần sử dụng của user
    const userUsage = promotion.user_usage.find(
      (usage) => usage.user.toString() === userId
    );
    if (userUsage && userUsage.usageCount >= promotion.max_usage_per_user) {
      throw new AppError(
        `You can only use this promotion ${promotion.max_usage_per_user} times`,
        400
      );
    }

    // Tính số tiền giảm giá
    let discountAmount = 0;
    if (promotion.discount_type === "percentage") {
      discountAmount = totalAmount * (promotion.discount_percent / 100);
    } else {
      discountAmount = promotion.discount_amount;
    }

    // Cập nhật số lần sử dụng
    promotion.used_count += 1;
    if (userUsage) {
      userUsage.usageCount += 1;
    } else {
      promotion.user_usage.push({ user: userId, usageCount: 1 });
    }
    await promotion.save();

    return {
      originalAmount: totalAmount,
      discountAmount: discountAmount,
      finalAmount: Math.max(0, totalAmount - discountAmount)
    };
  };

  static handleGetActivePromotions = async (userId) => {
    const currentDate = new Date();
    
    // Tìm các voucher đang active và trong thời gian hiệu lực
    const promotions = await Promotion.find({
      is_active: true,
      valid_from: { $lte: currentDate },
      valid_to: { $gte: currentDate }
    }).select('code discount_type discount_amount discount_percent min_order_amount description user_usage max_usage max_usage_per_user used_count')
      .lean();

    if (!promotions || promotions.length === 0) {
      return []; // Trả về mảng rỗng thay vì throw error
    }

    // Lọc và format vouchers
    return promotions
      .filter(promotion => {
        // Kiểm tra số lần sử dụng tổng
        if (!promotion.max_usage || !promotion.used_count) return true;
        return promotion.used_count < promotion.max_usage;
      })
      .map(promotion => {
        // Kiểm tra xem có phải voucher cá nhân không
        const userUsage = promotion.user_usage?.find(
          usage => usage.user && usage.user.toString() === userId
        );

        // Nếu là voucher cá nhân, kiểm tra số lần sử dụng
        if (userUsage && promotion.max_usage_per_user) {
          if (userUsage.usageCount >= promotion.max_usage_per_user) {
            return null;
          }
        }

        const discountAmount = promotion.discount_type === "amount" ? 
          promotion.discount_amount || 0 : 
          promotion.discount_percent || 0;

        const description = promotion.description || 
          `Giảm ${promotion.discount_type === "amount" ? 
            (discountAmount || 0).toLocaleString() + "đ" : 
            discountAmount + "%"}`;

        return {
          code: promotion.code || "",
          discountType: promotion.discount_type || "amount",
          discountValue: discountAmount,
          minOrderAmount: promotion.min_order_amount || 0,
          description: description,
          isPersonal: !!userUsage,
          usageCount: userUsage?.usageCount || 0,
          maxUsagePerUser: promotion.max_usage_per_user || 1,
          remainingUses: promotion.max_usage ? 
            Math.max(0, promotion.max_usage - (promotion.used_count || 0)) : 
            null
        };
      })
      .filter(Boolean); // Loại bỏ các phần tử null
  };

  static async createFirstOrderFreeShipPromotion(userId) {
    try {
      const existingOrders = await Order.find({ user: userId });
      if (existingOrders.length > 0) {
        return null;
      }

      const code = `FREESHIP_${Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase()}`;

      const promotion = new Promotion({
        code,
        discount_type: "amount",
        discount_amount: 30000, // Giảm 30k tiền ship
        valid_from: new Date(),
        valid_to: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        is_active: true,
        max_usage: 1,
        max_usage_per_user: 1,
        min_order_amount: 0,
        description: "Miễn phí vận chuyển cho đơn hàng đầu tiên",
        user_usage: [{
          user: userId,
          usageCount: 0
        }]
      });

      await promotion.save();
      return promotion;
    } catch (error) {
      console.error("Error creating first order free ship promotion:", error);
      throw error;
    }
  }
}

module.exports = PromotionService;
