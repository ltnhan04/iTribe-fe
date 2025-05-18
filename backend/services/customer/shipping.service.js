const ShippingMethod = require("../../models/shippingMethod.model");
const AppError = require("../../helpers/appError.helper");

class ShippingService {
  // Danh sách các tỉnh theo khu vực
  static SOUTHERN_PROVINCES = [
    "Bình Dương",
    "Bình Phước",
    "Tây Ninh",
    "Bà Rịa – Vũng Tàu",
    "Long An",
    "Bến Tre",
    "Vĩnh Long",
    "Trà Vinh",
    "Hậu Giang",
    "Tiền Giang",
    "An Giang",
    "Kiên Giang",
    "Đồng Nai",
    "Đồng Tháp",
    "Bạc Liêu",
    "Sóc Trăng",
    "Cà Mau",
    "Hồ Chí Minh",
    "Cần Thơ",
  ];

  static CENTRAL_PROVINCES = [
    "Thanh Hóa",
    "Nghệ An",
    "Hà Tĩnh",
    "Quảng Bình",
    "Quảng Trị",
    "Thừa Thiên-Huế",
    "Đà Nẵng",
    "Quảng Nam",
    "Quảng Ngãi",
    "Bình Định",
    "Phú Yên",
    "Khánh Hòa",
    "Ninh Thuận",
    "Bình Thuận",
    "Kon Tum",
    "Gia Lai",
    "Đắk Lắk",
    "Đắk Nông",
    "Lâm Đồng",
  ];

  static NORTHERN_PROVINCES = [
    "Lào Cai",
    "Yên Bái",
    "Điện Biên",
    "Hòa Bình",
    "Lai Châu",
    "Sơn La",
    "Hà Giang",
    "Cao Bằng",
    "Bắc Kạn",
    "Lạng Sơn",
    "Tuyên Quang",
    "Thái Nguyên",
    "Phú Thọ",
    "Bắc Giang",
    "Quảng Ninh",
    "Bắc Ninh",
    "Hà Nam",
    "Hà Nội",
    "Hải Dương",
    "Hưng Yên",
    "Hải Phòng",
    "Nam Định",
    "Ninh Bình",
    "Thái Bình",
    "Vĩnh Phúc",
  ];

  // Khởi tạo dữ liệu shipping methods
  static async initializeShippingMethods() {
    const methods = [
      { name: "Tiêu chuẩn", basePrice: 15000 },
      { name: "Nhanh", basePrice: 25000 },
      { name: "Hỏa tốc", basePrice: 40000 },
    ];

    for (const method of methods) {
      await ShippingMethod.findOneAndUpdate({ name: method.name }, method, {
        upsert: true,
        new: true,
      });
    }
  }

  // Lấy danh sách shipping methods dựa trên tỉnh
  static async getShippingMethods(province) {
    const methods = await ShippingMethod.find({ isActive: true });

    // Tính toán phí ship dựa trên khu vực
    const regionFee = this.getRegionFee(province);

    // Nếu không phải khu vực miền Nam, loại bỏ phương thức Hỏa tốc
    const availableMethods = methods
      .map((method) => {
        if (
          method.name === "Hỏa tốc" &&
          !this.SOUTHERN_PROVINCES.includes(province)
        ) {
          return null;
        }
        return {
          ...method.toObject(),
          finalPrice: method.basePrice + regionFee,
        };
      })
      .filter((method) => method !== null);

    return availableMethods;
  }

  // Tính phí ship dựa trên khu vực
  static getRegionFee(province) {
    if (this.SOUTHERN_PROVINCES.includes(province)) {
      return 10000;
    } else if (this.CENTRAL_PROVINCES.includes(province)) {
      return 20000;
    } else if (this.NORTHERN_PROVINCES.includes(province)) {
      return 30000;
    }
    throw new AppError("Invalid province", 400);
  }

  // Tính phí ship cho một phương thức cụ thể
  static async calculateShippingFee(methodId, province) {
    const method = await ShippingMethod.findById(methodId);
    if (!method) {
      throw new AppError("Shipping method not found", 404);
    }

    // Kiểm tra nếu là phương thức Hỏa tốc và không phải khu vực miền Nam
    if (
      method.name === "Hỏa tốc" &&
      !this.SOUTHERN_PROVINCES.includes(province)
    ) {
      throw new AppError(
        "Express shipping is only available in Southern provinces",
        400
      );
    }

    const regionFee = this.getRegionFee(province);
    return method.basePrice + regionFee;
  }
}

module.exports = ShippingService;
