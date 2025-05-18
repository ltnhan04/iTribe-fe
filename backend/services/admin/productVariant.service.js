const { uploadImage, deleteImage } = require("../../helpers/cloudinary.helper");
const Product = require("../../models/product.model");
const ProductVariant = require("../../models/productVariant.model");
const AppError = require("../../helpers/appError.helper");

class ProductVariantService {
  static handleDetailsVariant = async (variantId) => {
    const variant = await ProductVariant.findById(variantId);
    if (!variant) {
      throw new AppError("Variant not found", 404);
    }
    return variant;
  };
  static handleCreateProductVariant = async (
    product,
    colorName,
    colorCode,
    storage,
    price,
    stock_quantity,
    name,
    slug,
    files
  ) => {
    const foundProduct = await Product.findById(product);
    if (!foundProduct) {
      throw new AppError("Product not found", 404);
    }
    let imageUrls = [];
    if (files && files.length > 0) {
      imageUrls = await uploadImage(files);
    }
    const productVariant = new ProductVariant({
      product,
      name,
      color: { colorName, colorCode },
      storage,
      price,
      stock_quantity,
      slug,
      images: imageUrls,
    });

    const savedProductVariant = await productVariant.save();
    if (!savedProductVariant) {
      throw new AppError("Failed to create product variant", 500);
    }

    foundProduct.variants.push(savedProductVariant._id);

    if (!foundProduct.image && imageUrls.length > 0) {
      foundProduct.image = imageUrls[0];
    }
    await foundProduct.save();
    return savedProductVariant;
  };

  static handleUpdateProductVariant = async (
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
    files
  ) => {
    const productVariant = await ProductVariant.findById(variantId);
    if (!productVariant) {
      throw new AppError("Product variant not found", 404);
    }
    const parsedExistingImages = existingImages
      ? JSON.parse(existingImages)
      : productVariant.images;
    const imagesToDelete = productVariant.images.filter(
      (image) => !parsedExistingImages.includes(image)
    );
    if (imagesToDelete.length > 0) {
      await deleteImage(imagesToDelete);
    }
    let newImages = [];
    if (files && files.length > 0) {
      newImages = await uploadImage(files);
    }
    const updatedImages = [...parsedExistingImages, ...newImages];
    const updates = {
      product: product ?? productVariant.product,
      name: name ?? productVariant.name,
      slug: slug ?? productVariant.slug,
      color: {
        colorName: colorName ?? productVariant.color.colorName,
        colorCode: colorCode ?? productVariant.color.colorCode,
      },
      storage: storage ?? productVariant.storage,
      stock_quantity:
        stock_quantity !== undefined
          ? Number(stock_quantity)
          : productVariant.stock_quantity,
      price: price !== undefined ? Number(price) : productVariant.price,
      images: updatedImages,
    };
    const updatedProductVariant = await ProductVariant.findByIdAndUpdate(
      variantId,
      updates,
      { new: true }
    );
    if (!updatedProductVariant) {
      throw new AppError("Product variant not found after update", 404);
    }
    return updatedProductVariant;
  };

  static handleDeleteProductVariant = async (variantId) => {
    try {
      const productVariant = await ProductVariant.findById(variantId);
      if (!productVariant) {
        throw new AppError("Product variant not found", 404);
      }
      const product = await Product.findById(productVariant.product);
      if (!product) {
        throw new AppError("Product not found", 404);
      }
      if (productVariant.images && productVariant.images.length > 0) {
        await deleteImage(productVariant.images);
      }
      await ProductVariant.findByIdAndDelete(variantId);
      product.variants = product.variants.filter(
        (id) => id.toString() !== variantId
      );
      if (product.image === productVariant.images[0]) {
        const newVariant = await ProductVariant.findOne({
          product: product._id,
        });
        if (newVariant && newVariant.images.length > 0) {
          product.image = newVariant.images[0];
        } else {
          product.image = null;
        }
      }

      await product.save();
      return { message: "Product variant deleted successfully!" };
    } catch (error) {
      throw error;
    }
  };

  // static handleImportVariantFromExcel = async (productId, file) => {
  //   if (!file) {
  //     throw new AppError("No file uploaded", 404);
  //   }

  //   const product = await Product.findById(productId);
  //   if (!product) {
  //     throw new AppError("Product not found", 404);
  //   }

  //   const workbook = XLSX.readFile(file.path);
  //   const sheetName = workbook.SheetNames[0];
  //   const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

  //   const variants = sheetData.map((row) => ({
  //     productId,
  //     name: row["Name"],
  //     slug: row["Slug"],
  //     color: {
  //       colorName: row["Color Name"],
  //       colorCode: row["Color Code"],
  //     },
  //     storage: row["Storage"],
  //     price: row["Price"],
  //     stock: row["Stock"],
  //     images: row["Image URLs"] ? row["Image URLs"].split(",") : [],
  //   }));

  //   const savedVariants = [];
  //   for (const variant of variants) {
  //     const productVariant = new ProductVariant(variant);

  //     const savedVariant = await productVariant.save();
  //     product.variants.push(savedVariant._id);

  //     if (!product.image && savedVariant.images.length > 0) {
  //       product.image = savedVariant.images[0];
  //     }

  //     savedVariants.push(savedVariant);
  //   }

  //   await product.save();

  //   fs.unlink(file.path, (err) => {
  //     if (err) {
  //       console.error("Error deleting file:", err);
  //     } else {
  //       console.log("Temporary file deleted:", file.path);
  //     }
  //   });
  //   return savedVariants;
  // };
}

module.exports = ProductVariantService;
