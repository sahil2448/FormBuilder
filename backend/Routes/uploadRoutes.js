// routes/uploadRoutes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const authMiddleware = require("../middleware/authMiddleware");
const { uploadImage, deleteImage } = require("../controllers/uploadController");

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  },
});

// Image upload routes
router.post("/image", authMiddleware, upload.single("image"), uploadImage);
router.delete("/image/:publicId", authMiddleware, deleteImage);

module.exports = router;
