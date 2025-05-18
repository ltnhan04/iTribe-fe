const mongoose = require("mongoose");

const shippingMethodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      enum: ["Tiêu chuẩn", "Nhanh", "Hỏa tốc"],
    },
    basePrice: {
      type: Number,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ShippingMethod", shippingMethodSchema); 