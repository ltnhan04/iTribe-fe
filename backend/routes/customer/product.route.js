const express = require("express");
const router = express.Router();
const {
  getAllProductsUser,
  getProductById,
  // getProductByName,
  // getPaginatedProducts,
  // searchProducts,
  // getProductByPriceRange,
  getProductsByCategory,
  getVariantBySlug,
} = require("../../controllers/customer/product.controller");

// router.get("/search", searchProducts);
// router.get("/range", getProductByPriceRange);
// router.get("/paginate", getPaginatedProducts);
router.get("/filter", getProductsByCategory);
router.get("/", getAllProductsUser);
router.get("/:id", getProductById);
router.post("/", getVariantBySlug);
// router.get("/product/:id", getProductById);
// router.get("/name/:name", getProductByName);

module.exports = router;
