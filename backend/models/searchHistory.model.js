const mongoose = require("mongoose");

const searchHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    searchQuery: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      default: null,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    searchCount: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
searchHistorySchema.index({ userId: 1, searchQuery: 1 });
searchHistorySchema.index({ timestamp: -1 });

module.exports = mongoose.model("SearchHistory", searchHistorySchema); 