const Point = require("../../models/point.model");
const PointVoucher = require("../../models/pointVoucher.model");
const AppError = require("../../helpers/appError.helper");

class PointService {
  static calculatePoints(orderAmount) {
    return Math.floor(orderAmount / 100000); // 100.000 VND = 1 điểm
  }

  static async addPointsForOrder(order) {
    try {
      const points = this.calculatePoints(order.totalAmount);
      if (points <= 0) return null;

      const expiryDate = new Date();
      expiryDate.setMonth(expiryDate.getMonth() + 6); // 6 tháng

      const point = new Point({
        customer: order.user,
        points,
        order: order._id,
        expiryDate,
      });

      await point.save();
      return point;
    } catch (error) {
      console.error("Error adding points for order:", error);
      throw error;
    }
  }

  static async getCustomerPoints(customerId) {
    try {
      const points = await Point.find({
        customer: customerId,
        isExpired: false,
        expiryDate: { $gt: new Date() },
      });

      return points.reduce((total, point) => total + point.points, 0);
    } catch (error) {
      console.error("Error getting customer points:", error);
      throw error;
    }
  }

  static async exchangePointsForVoucher(customerId, pointsToUse) {
    try {
      const availablePoints = await this.getCustomerPoints(customerId);
      if (availablePoints < pointsToUse) {
        throw new AppError("Insufficient points", 400);
      }

      let discountAmount;
      if (pointsToUse >= 500) {
        discountAmount = 1000000; // 500 điểm = 1 triệu
      } else if (pointsToUse >= 300) {
        discountAmount = 500000; // 300 điểm = 500k
      } else if (pointsToUse >= 100) {
        discountAmount = 100000; // 100 điểm = 100k
      } else {
        throw new AppError("Invalid points amount", 400);
      }

      const voucher = new PointVoucher({
        customer: customerId,
        code: `POINT_${Math.random()
          .toString(36)
          .substring(2, 8)
          .toUpperCase()}`,
        discountAmount,
        pointsUsed: pointsToUse,
        validFrom: new Date(),
        validTo: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 ngày
      });

      await voucher.save();

      await this.deductPoints(customerId, pointsToUse);

      return voucher;
    } catch (error) {
      console.error("Error exchanging points for voucher:", error);
      throw error;
    }
  }

  static async deductPoints(customerId, pointsToDeduct) {
    try {
      const points = await Point.find({
        customer: customerId,
        isExpired: false,
        expiryDate: { $gt: new Date() },
      }).sort({ expiryDate: 1 });

      let remainingPoints = pointsToDeduct;
      for (const point of points) {
        if (remainingPoints <= 0) break;

        if (point.points <= remainingPoints) {
          remainingPoints -= point.points;
          point.points = 0;
          point.isExpired = true;
        } else {
          point.points -= remainingPoints;
          remainingPoints = 0;
        }

        await point.save();
      }
    } catch (error) {
      console.error("Error deducting points:", error);
      throw error;
    }
  }

  static async checkAndRemoveExpiredPoints() {
    try {
      const expiredPoints = await Point.find({
        isExpired: false,
        expiryDate: { $lte: new Date() },
      });

      for (const point of expiredPoints) {
        point.isExpired = true;
        await point.save();
      }

      return expiredPoints.length;
    } catch (error) {
      console.error("Error checking expired points:", error);
      throw error;
    }
  }

  static async validateVoucher(code, customerId) {
    try {
      const voucher = await PointVoucher.findOne({
        code,
        customer: customerId,
        status: "unused",
        validFrom: { $lte: new Date() },
        validTo: { $gte: new Date() },
      });

      if (!voucher) {
        throw new AppError("Invalid or expired voucher", 400);
      }

      return voucher;
    } catch (error) {
      console.error("Error validating voucher:", error);
      throw error;
    }
  }

  static async markVoucherAsUsed(voucherId, orderId) {
    try {
      const voucher = await PointVoucher.findByIdAndUpdate(
        voucherId,
        {
          status: "used",
          usedOrder: orderId,
        },
        { new: true }
      );

      return voucher;
    } catch (error) {
      console.error("Error marking voucher as used:", error);
      throw error;
    }
  }

  static applyVoucherToOrder = async (voucherCode, customerId, orderTotal) => {
    const voucher = await this.validateVoucher(voucherCode, customerId);
    const discountedTotal = Math.max(orderTotal - voucher.discountAmount, 0);

    return {
      discountedTotal,
      voucherId: voucher._id,
      discountAmount: voucher.discountAmount,
    };
  };
}

module.exports = PointService;
