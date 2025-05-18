const router = require("express").Router();
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });
const { verifyAdmin } = require("../../middleware/auth.middleware");

const {
  getAllProductsAdmin,
  getProductDetailsAdmin,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
} = require("../../controllers/admin/product.controller");

router.get("/filter", verifyAdmin, getProductsByCategory);
router.get("/:id", verifyAdmin, getProductDetailsAdmin);
router.get("/", verifyAdmin, getAllProductsAdmin);
router.post("/", verifyAdmin, createProduct);
router.put("/:id", verifyAdmin, upload.single("image"), updateProduct);
router.delete("/:id", verifyAdmin, deleteProduct);

module.exports = router;
