const cloudinary = require("../libs/cloudinary");

class CloudinaryHelper {
  static uploadImage = async (files) => {
    let images = [];

    if (!Array.isArray(files)) {
      files = [files];
    }

    for (const file of files) {
      const cloudinaryResponse = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "products" },
          (err, result) => {
            if (err) reject(err);
            else resolve(result);
          }
        );
        uploadStream.end(file.buffer);
      });
      images.push(cloudinaryResponse.secure_url);
    }
    return images;
  };

  static deleteImage = async (images) => {
    try {
      if (Array.isArray(images) && images.length > 0) {
        for (const image of images) {
          const publicId = image.split("/").pop().split(".")[0];
          await cloudinary.uploader.destroy(`products/${publicId}`);
        }
      } else {
        const publicId = images.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`products/${publicId}`);
      }
      console.log("Deleted image from Cloudinary");
    } catch (error) {
      console.error("Error deleting image from Cloudinary:", error);
    }
  };
}
module.exports = CloudinaryHelper;
