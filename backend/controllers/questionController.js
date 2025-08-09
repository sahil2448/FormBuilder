// controllers/questionController.js
const {
  Question,
  CategorizeQuestion,
  ClozeQuestion,
  ComprehensionQuestion,
} = require("../models/Question");
const Form = require("../models/Form");

const createQuestion = async (req, res) => {
  try {
    const { questionType, formId, ...questionData } = req.body;

    // Verify form ownership
    const form = await Form.findOne({
      _id: formId,
      createdBy: req.user.id,
    });

    if (!form) {
      return res.status(404).json({
        success: false,
        error: "Form not found or unauthorized",
      });
    }

    let newQuestion;

    switch (questionType) {
      case "categorize":
        newQuestion = new CategorizeQuestion({
          ...questionData,
          questionType,
          order: form.questions.length + 1,
        });
        break;
      case "cloze":
        newQuestion = new ClozeQuestion({
          ...questionData,
          questionType,
          order: form.questions.length + 1,
        });
        break;
      case "comprehension":
        newQuestion = new ComprehensionQuestion({
          ...questionData,
          questionType,
          order: form.questions.length + 1,
        });
        break;
      default:
        return res.status(400).json({
          success: false,
          error: "Invalid question type",
        });
    }

    await newQuestion.save();

    // Add question to form's questions array
    await Form.findByIdAndUpdate(formId, {
      $push: { questions: newQuestion._id },
    });

    res.status(201).json({
      success: true,
      message: "Question created successfully",
      data: newQuestion,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

const getQuestions = async (req, res) => {
  try {
    const { formId } = req.params;

    // Verify form ownership
    const form = await Form.findOne({
      _id: formId,
      createdBy: req.user.id,
    });

    if (!form) {
      return res.status(404).json({
        success: false,
        error: "Form not found or unauthorized",
      });
    }

    const questions = await Question.find({
      _id: { $in: form.questions },
    }).sort({ order: 1 });

    res.json({
      success: true,
      data: questions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const getQuestionById = async (req, res) => {
  try {
    const { id } = req.params;

    const question = await Question.findById(id);

    if (!question) {
      return res.status(404).json({
        success: false,
        error: "Question not found",
      });
    }

    res.json({
      success: true,
      data: question,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { questionType, ...updateData } = req.body;

    let updatedQuestion;

    switch (questionType) {
      case "categorize":
        updatedQuestion = await CategorizeQuestion.findByIdAndUpdate(
          id,
          updateData,
          { new: true, runValidators: true }
        );
        break;
      case "cloze":
        updatedQuestion = await ClozeQuestion.findByIdAndUpdate(
          id,
          updateData,
          { new: true, runValidators: true }
        );
        break;
      case "comprehension":
        updatedQuestion = await ComprehensionQuestion.findByIdAndUpdate(
          id,
          updateData,
          { new: true, runValidators: true }
        );
        break;
      default:
        return res.status(400).json({
          success: false,
          error: "Invalid question type",
        });
    }

    if (!updatedQuestion) {
      return res.status(404).json({
        success: false,
        error: "Question not found",
      });
    }

    res.json({
      success: true,
      message: "Question updated successfully",
      data: updatedQuestion,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    const question = await Question.findByIdAndDelete(id);

    if (!question) {
      return res.status(404).json({
        success: false,
        error: "Question not found",
      });
    }

    // Remove question from all forms that reference it
    await Form.updateMany({ questions: id }, { $pull: { questions: id } });

    res.json({
      success: true,
      message: "Question deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const getQuestionsByType = async (req, res) => {
  try {
    const { questionType } = req.params;

    const questions = await Question.find({ questionType }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      data: questions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const reorderQuestions = async (req, res) => {
  try {
    const { questionOrders } = req.body; // Array of { questionId, order }

    const updatePromises = questionOrders.map(({ questionId, order }) =>
      Question.findByIdAndUpdate(questionId, { order })
    );

    await Promise.all(updatePromises);

    res.json({
      success: true,
      message: "Questions reordered successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = {
  createQuestion,
  getQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
  getQuestionsByType,
  reorderQuestions,
};
