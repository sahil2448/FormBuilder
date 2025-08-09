// controllers/uploadController.js
const cloudinary = require("cloudinary").v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "No file uploaded",
      });
    }

    // Convert buffer to base64
    const fileStr = req.file.buffer.toString("base64");
    const fileUri = `data:${req.file.mimetype};base64,${fileStr}`;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(fileUri, {
      folder: "form-builder",
      resource_type: "image",
      transformation: [
        { width: 800, height: 600, crop: "limit" },
        { quality: "auto" },
      ],
    });

    res.json({
      success: true,
      message: "Image uploaded successfully",
      data: {
        url: result.secure_url,
        publicId: result.public_id,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const deleteImage = async (req, res) => {
  try {
    const { publicId } = req.params;

    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result === "ok") {
      res.json({
        success: true,
        message: "Image deleted successfully",
      });
    } else {
      res.status(400).json({
        success: false,
        error: "Failed to delete image",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = {
  uploadImage,
  deleteImage,
};
