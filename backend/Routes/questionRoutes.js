// routes/questionRoutes.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  createQuestion,
  getQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
  getQuestionsByType,
  reorderQuestions,
} = require("../controllers/questionController");

router.use(authMiddleware);

router.post("/", createQuestion);
router.get("/form/:formId", getQuestions);
router.get("/:id", getQuestionById);
router.put("/:id", updateQuestion);
router.delete("/:id", deleteQuestion);

router.get("/type/:questionType", getQuestionsByType);
router.patch("/reorder", reorderQuestions);

module.exports = router;
