require("dotenv").config();

const cloudinary = require("cloudinary").v2;
async function cloudinaryConfig() {
  try {
    await cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    console.log("Cloudinary Connected successfully");
  } catch (error) {
    console.log("Cloudinary Connected Error");
  }
}

module.exports = cloudinaryConfig;