const ProductVariantService = require("../../services/admin/productVariant.service");

const detailsVariant = async (req, res, next) => {
  try {
    const variantId = req.params.variantId;
    const variant = await ProductVariantService.handleDetailsVariant(variantId);
    res.status(200).json({
      message: "Get variant successfully!",
      data: variant,
    });
  } catch (error) {
    next(error);
  }
};
const createProductVariant = async (req, res, next) => {
  try {
    const {
      product,
      colorName,
      colorCode,
      storage,
      price,
      stock_quantity,
      name,
      slug,
    } = req.body;

    const productVariant =
      await ProductVariantService.handleCreateProductVariant(
        product,
        colorName,
        colorCode,
        storage,
        price,
        stock_quantity,
        name,
        slug,
        req.files
      );

    res.status(201).json({
      message: "Product variant created successfully!",
      data: productVariant,
    });
  } catch (error) {
    next(error);
  }
};
const updateProductVariant = async (req, res, next) => {
  try {
    const { variantId } = req.params;
    const {
      existingImages,
      colorName,
      colorCode,
      storage,
      price,
      stock_quantity,
      name,
      slug,
      product,
    } = req.body;

    const updatedProductVariant =
      await ProductVariantService.handleUpdateProductVariant(
        variantId,
        existingImages,
        colorName,
        colorCode,
        storage,
        price,
        stock_quantity,
        name,
        slug,
        product,
        req.files
      );

    res.status(200).json({
      message: "Product variant updated successfully",
      data: updatedProductVariant,
    });
  } catch (error) {
    next(error);
  }
};

const deleteProductVariant = async (req, res, next) => {
  const { variantId } = req.params;
  try {
    const { message } = await ProductVariantService.handleDeleteProductVariant(
      variantId
    );
    res.status(200).json({ message });
  } catch (error) {
    next(error);
  }
};

// const importVariantFromExcel = async (req, res, next) => {
//   const { productId } = req.body;

//   try {
//     const savedVariants =
//       await ProductVariantService.handleImportVariantFromExcel(
//         productId,
//         req.file
//       );

//     res.status(201).json({
//       message: "Variants imported successfully!",
//       variants: savedVariants,
//     });
//   } catch (error) {
//     if (req.file && req.file.path) {
//       fs.unlink(req.file.path, (err) => {
//         if (err) console.error("Error deleting file:", err);
//       });
//     }

//     next(error);
//   }
// };

module.exports = {
  createProductVariant,
  updateProductVariant,
  deleteProductVariant,
  detailsVariant,
  // importVariantFromExcel,
};
