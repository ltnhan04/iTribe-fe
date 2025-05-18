const ReviewService = require("../../services/admin/review.service");
const deleteReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedReview = await ReviewService.handleDeleteReview(id);
    res
      .status(200)
      .json({ message: "Review deleted successfully", review: deletedReview });
  } catch (error) {
    next(error);
  }
};
module.exports = { deleteReview };
