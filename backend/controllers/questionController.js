// controllers/questionController.js
const {
  Question,
  CategorizeQuestion,
  ClozeQuestion,
  ComprehensionQuestion,
} = require("../models/Question");

const createQuestion = async (req, res) => {
  try {
    const { questionType, ...questionData } = req.body;

    let newQuestion;

    switch (questionType) {
      case "categorize":
        newQuestion = new CategorizeQuestion(questionData);
        break;
      case "cloze":
        newQuestion = new ClozeQuestion(questionData);
        break;
      case "comprehension":
        newQuestion = new ComprehensionQuestion(questionData);
        break;
      default:
        return res.status(400).json({ error: "Invalid question type" });
    }

    await newQuestion.save();
    res.status(201).json(newQuestion);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find();
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getQuestionsByType = async (req, res) => {
  try {
    const { type } = req.params;
    const questions = await Question.find({ questionType: type });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
