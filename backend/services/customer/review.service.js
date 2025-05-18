const AppError = require("../../helpers/appError.helper");
const Review = require("../../models/reviews.model");
const ProductVariant = require("../../models/productVariant.model");
const User = require("../../models/user.model");

class ReviewService {
  static handleGetReview = async () => {
    const reviews = await Review.find({}).populate("user");
    if (!reviews) {
      throw new AppError("No reviews found", 404);
    }

    return reviews;
  };

  static handleCreateReview = async (
    productVariantId,
    rating,
    comment,
    userId
  ) => {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError("Customer not found", 404);
    }
    const productVariant = await ProductVariant.findById(productVariantId);
    if (!productVariant) {
      throw new AppError("Product variant not found", 404);
    }
    const existingReview = await Review.findOne({
      user: userId,
      variant: productVariantId,
    });
    if (existingReview) {
      throw new AppError("You have already reviewed this product", 400);
    }

    const review = new Review({
      variant: productVariantId,
      user: userId,
      rating,
      comment,
    });
    const savedReview = await review.save();
    if (!savedReview) {
      throw new AppError("Failed to save review", 400);
    }
    productVariant.reviews.push(savedReview._id);
    await productVariant.save();
    return savedReview;
  };

  static handleUpdateReview = async (
    id,
    userId,
    rating,
    comment,
    isAnonymous
  ) => {
    const review = await Review.findById(id);
    if (!review) {
      throw new AppError("Review not found", 404);
    }
    if (review.user.toString() !== userId.toString()) {
      throw new AppError("You can only update your own reviews", 403);
    }

    const updatedReview = await Review.findByIdAndUpdate(
      id,
      { rating, comment, isAnonymous },
      { new: true }
    );
    return updatedReview;
  };

  static handleDeleteReview = async (id, userId) => {
    const review = await Review.findById(id);
    if (!review) {
      throw new AppError("Review not found", 404);
    }
    if (review.user.toString() !== userId.toString()) {
      throw new AppError("You can only delete your own reviews", 403);
    }

    await ProductVariant.updateOne(
      { _id: review.variant },
      { $pull: { reviews: id } }
    );
    const deletedReview = await Review.findByIdAndDelete(id);
    return deletedReview;
  };
}
module.exports = ReviewService;
