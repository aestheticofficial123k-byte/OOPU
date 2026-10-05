/**
 * config/cloudinary.js
 * Configures Cloudinary SDK + memory upload middleware.
 */

const cloudinary = require("cloudinary").v2
const multer = require("multer")

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Store the processed image in memory before sending it to Cloudinary
const storage = multer.memoryStorage()

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
})

module.exports = {
  cloudinary,
  upload,
}