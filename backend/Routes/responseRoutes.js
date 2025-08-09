// routes/responseRoutes.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  submitResponse,
  getFormResponses,
  getResponseById,
  deleteResponse,
  getResponseStats,
} = require("../controllers/responseController");

// Public route for form submission
router.post("/submit/:shareableLink", submitResponse);

// Protected routes for response management
router.get("/form/:formId", authMiddleware, getFormResponses);
router.get("/:id", authMiddleware, getResponseById);
router.delete("/:id", authMiddleware, deleteResponse);
router.get("/form/:formId/stats", authMiddleware, getResponseStats);

module.exports = router;
