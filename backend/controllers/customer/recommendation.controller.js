const RecommendationService = require("../../services/customer/recommendation.service");

//Lưu lại lịch sử tìm kiếm
const saveSearchHistory = async (req, res, next) => {
  try {
    const { searchQuery } = req.body;
    await RecommendationService.saveSearchHistory(req.user._id, searchQuery);
    
    res.status(200).json({
      status: "success",
      message: "Search history saved successfully"
    });
  } catch (error) {
    next(error);
  }
};

const getRecommendedProducts = async (req, res, next) => {
  try {
    const { limit } = req.query;
    const products = await RecommendationService.getRecommendedProducts(
      req.user._id,
      parseInt(limit) || 10
    );

    res.status(200).json({
      status: "success",
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

const getPopularProducts = async (req, res, next) => {
  try {
    const { limit } = req.query;
    const products = await RecommendationService.getPopularProducts(
      parseInt(limit) || 10
    );

    res.status(200).json({
      status: "success",
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

const getSearchSuggestions = async (req, res, next) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(200).json({
        status: "success",
        data: [],
      });
    }

    const suggestions = await RecommendationService.getSearchSuggestions(
      req.user._id,
      query
    );

    res.status(200).json({
      status: "success",
      data: suggestions,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRecommendedProducts,
  getPopularProducts,
  getSearchSuggestions,
  saveSearchHistory
}; 