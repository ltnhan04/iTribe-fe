const ReviewService = require("../../services/customer/review.service");

const getReviews = async (_, res, next) => {
  try {
    const reviews = await ReviewService.handleGetReview();
    res.status(200).json({ message: "Reviews fetched successfully", reviews });
  } catch (error) {
    next(error);
  }
};
const createReview = async (req, res, next) => {
  try {
    const { variant, rating, comment } = req.body;
    const userId = req.user._id;

    const savedReview = await ReviewService.handleCreateReview(
      variant,
      rating,
      comment,
      userId
    );

    res
      .status(201)
      .json({ message: "Review created successfully", data: savedReview });
  } catch (error) {
    next(error);
  }
};

const updateReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    const updatedReview = await ReviewService.handleUpdateReview(
      id,
      req.user._id,
      rating,
      comment
    );

    res
      .status(200)
      .json({ message: "Review updated successfully", data: updatedReview });
  } catch (error) {
    next(error);
  }
};

const deleteReview = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedReview = await ReviewService.handleDeleteReview(
      id,
      req.user._id
    );

    res
      .status(200)
      .json({ message: "Review deleted successfully", data: deletedReview });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getReviews,
  createReview,
  updateReview,
  deleteReview,
};
