const mongoose = require("mongoose");

const faqSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },
    answer: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["order", "product", "shipping", "voucher", "general"],
      default: "general",
    },
    keywords: [{
      type: String,
      trim: true,
    }],
    usageCount: {
      type: Number,
      default: 0,
    },
    lastUsed: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Add text index for search
faqSchema.index({ question: 'text', keywords: 'text' });

const FAQ = mongoose.model("FAQ", faqSchema);

module.exports = FAQ; 