// routes/formRoutes.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  createForm,
  getForms,
  getFormById,
  updateForm,
  deleteForm,
  publishForm,
  getPublicForm,
} = require("../controllers/formController");

router.post("/", authMiddleware, createForm);
router.get("/", authMiddleware, getForms);
router.get("/:id", authMiddleware, getFormById);
router.put("/:id", authMiddleware, updateForm);
router.delete("/:id", authMiddleware, deleteForm);
router.patch("/:id/publish", authMiddleware, publishForm);

router.get("/public/:shareableLink", getPublicForm);

module.exports = router;
