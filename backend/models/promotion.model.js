const mongoose = require("mongoose");

const promotionSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },
    discount_type: {
      type: String,
      enum: ["amount", "percentage"],
      required: true,
    },
    valid_from: {
      type: Date,
      required: true,
    },
    valid_to: {
      type: Date,
      required: true,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
    max_usage: {
      type: Number,
      default: 1,
    },
    max_usage_per_user: {
      type: Number,
      default: 1,
    },
    user_usage: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        usageCount: {
          type: Number,
          default: 0,
        },
      },
    ],

    min_order_amount: {
      type: Number,
      default: 0,
    },
    used_count: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Promotion", promotionSchema);
