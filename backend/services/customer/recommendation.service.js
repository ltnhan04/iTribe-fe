const SearchHistory = require("../../models/searchHistory.model");
const Product = require("../../models/product.model");
const AppError = require("../../helpers/appError.helper");

class RecommendationService {
  static async saveSearchHistory(userId, searchQuery, category = null) {
    try {
      const existingSearch = await SearchHistory.findOne({
        userId,
        searchQuery,
      });

      if (existingSearch) {
        existingSearch.searchCount += 1;
        existingSearch.timestamp = new Date();
        await existingSearch.save();
      } else {
        await SearchHistory.create({
          userId,
          searchQuery,
          category,
        });
      }
    } catch (error) {
      console.error("Error saving search history:", error);
    }
  }

  static async getRecommendedProducts(userId, limit = 10) {
    try {
      // Lấy lịch sử tìm kiếm gần đây của user
      const recentSearches = await SearchHistory.find({ userId })
        .sort({ timestamp: -1 })
        .limit(5);

      if (recentSearches.length === 0) {
        // Nếu không có lịch sử tìm kiếm, trả về sản phẩm phổ biến
        return this.getPopularProducts(limit);
      }

      // Tạo danh sách từ khóa tìm kiếm
      const searchQueries = recentSearches.map(search => search.searchQuery);
      const categories = recentSearches
        .map(search => search.category)
        .filter(category => category !== null);

      // Tìm sản phẩm dựa trên từ khóa và danh mục
      const products = await Product.find({
        $or: [
          { name: { $regex: searchQueries.join("|"), $options: "i" } },
          { description: { $regex: searchQueries.join("|"), $options: "i" } },
          { category: { $in: categories } },
        ],
      })
        .populate({
          path: "variants",
          select: "price stock_quantity images rating",
        })
        .limit(limit);

      // Nếu không tìm thấy đủ sản phẩm, bổ sung thêm sản phẩm phổ biến
      if (products.length < limit) {
        const popularProducts = await this.getPopularProducts(
          limit - products.length
        );
        products.push(...popularProducts);
      }

      return this.formatProductResponse(products);
    } catch (error) {
      console.error("Error getting recommended products:", error);
      throw new AppError("Failed to get recommended products", 500);
    }
  }

  static async getPopularProducts(limit = 10) {
    try {
      const products = await Product.find()
        .populate({
          path: "variants",
          select: "price stock_quantity images rating",
        })
        .sort({ "variants.rating": -1 })
        .limit(limit);

      return this.formatProductResponse(products);
    } catch (error) {
      console.error("Error getting popular products:", error);
      throw new AppError("Failed to get popular products", 500);
    }
  }

  static formatProductResponse(products) {
    return products.map(product => {
      const firstVariant = product.variants[0];
      return {
        _id: product._id,
        name: product.name,
        description: product.description,
        category: product.category,
        price: firstVariant ? firstVariant.price : 0,
        stock: firstVariant ? firstVariant.stock_quantity : 0,
        rating: firstVariant ? firstVariant.rating : 0,
        image: firstVariant?.images[0] || null,
      };
    });
  }

  static async getSearchSuggestions(userId, query) {
    try {
      const suggestions = await SearchHistory.find({
        userId,
        searchQuery: { $regex: query, $options: "i" },
      })
        .sort({ searchCount: -1, timestamp: -1 })
        .limit(5)
        .select("searchQuery category");

      return suggestions.map(suggestion => ({
        query: suggestion.searchQuery,
        category: suggestion.category,
      }));
    } catch (error) {
      console.error("Error getting search suggestions:", error);
      throw new AppError("Failed to get search suggestions", 500);
    }
  }
}

module.exports = RecommendationService; 