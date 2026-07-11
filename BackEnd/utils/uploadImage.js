const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadImage(imagePath) {
  try {
    const result = await cloudinary.uploader.upload(imagePath);
    return result;
  } catch (error) {
    console.log("Error uploadImage:", error.message);
    throw error; // important: don't swallow it, let the controller's catch handle it
  }
}

async function deleteImage(imageId) {
  try {
    await cloudinary.uploader.destroy(imageId);
  } catch (error) {
    console.log("Error deleteImage:", error.message);
    throw error;
  }
}

module.exports = { uploadImage, deleteImage };