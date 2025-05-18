const Review = require("../../models/reviews.model");
const ProductVariant = require("../../models/productVariant.model");
const AppError = require("../../helpers/appError.helper");

class ReviewService {
  static handleDeleteReview = async (id) => {
    const review = await Review.findById(id);
    if (!review) {
      throw new AppError("Review not found", 404);
    }

    const deletedReview = await Review.findByIdAndDelete(id);
    if (!deletedReview) {
      throw new AppError(`Failed to delete review`, 400);
    }

    await ProductVariant.updateOne(
      {
        _id: review.productId,
      },
      {
        $pull: { reviews: id },
      }
    );
    return deletedReview;
  };
}

module.exports = ReviewService;
