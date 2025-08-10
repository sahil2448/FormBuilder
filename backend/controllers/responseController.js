// controllers/responseController.js
const FormResponse = require("../models/FormResponse");
const Form = require("../models/Form");
const { Question } = require("../models/Question");

const submitResponse = async (req, res) => {
  try {
    const { shareableLink } = req.params;
    const { answers, respondentEmail, respondentName, completionTime } =
      req.body;

    // Find the form
    const form = await Form.findOne({
      shareableLink,
      isPublished: true,
    }).populate("questions");

    if (!form) {
      return res.status(404).json({
        success: false,
        error: "Form not found or not published",
      });
    }

    // Calculate scores for each answer
    const scoredAnswers = [];
    let totalScore = 0;
    let maxPossibleScore = 0;

    for (const answer of answers) {
      const question = form.questions.find(
        (q) => q._id.toString() === answer.questionId
      );
      if (!question) continue;

      let isCorrect = false;
      let pointsEarned = 0;

      // Score based on question type
      switch (question.questionType) {
        case "categorize":
          isCorrect = checkCategorizeAnswer(question, answer.answer);
          break;
        case "cloze":
          isCorrect = checkClozeAnswer(question, answer.answer);
          break;
        case "comprehension":
          isCorrect = checkComprehensionAnswer(question, answer.answer);
          break;
      }

      if (isCorrect) {
        pointsEarned = question.points || 1;
        totalScore += pointsEarned;
      }

      maxPossibleScore += question.points || 1;

      scoredAnswers.push({
        ...answer,
        isCorrect,
        pointsEarned,
      });
    }

    // Create response record
    const response = new FormResponse({
      formId: form._id,
      respondentEmail: respondentEmail || null,
      respondentName: respondentName || "Anonymous",
      answers: scoredAnswers,
      totalScore,
      maxPossibleScore,
      completionTime: completionTime || 0,
      ipAddress: req.ip,
      userAgent: req.get("User-Agent"),
    });

    await response.save();

    res.status(201).json({
      success: true,
      message: "Response submitted successfully",
      data: {
        responseId: response._id,
        totalScore,
        maxPossibleScore,
        percentage: Math.round((totalScore / maxPossibleScore) * 100),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const getFormResponses = async (req, res) => {
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

    const responses = await FormResponse.find({ formId })
      .sort({ createdAt: -1 })
      .populate("formId", "title");

    res.json({
      success: true,
      data: responses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const getResponseById = async (req, res) => {
  try {
    const { id } = req.params;

    const response = await FormResponse.findById(id)
      .populate("formId", "title")
      .populate("answers.questionId");

    if (!response) {
      return res.status(404).json({
        success: false,
        error: "Response not found",
      });
    }

    // Verify form ownership
    const form = await Form.findOne({
      _id: response.formId,
      createdBy: req.user.id,
    });

    if (!form) {
      return res.status(403).json({
        success: false,
        error: "Unauthorized access",
      });
    }

    res.json({
      success: true,
      data: response,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const deleteResponse = async (req, res) => {
  try {
    const { id } = req.params;

    const response = await FormResponse.findById(id);

    if (!response) {
      return res.status(404).json({
        success: false,
        error: "Response not found",
      });
    }

    // Verify form ownership
    const form = await Form.findOne({
      _id: response.formId,
      createdBy: req.user.id,
    });

    if (!form) {
      return res.status(403).json({
        success: false,
        error: "Unauthorized access",
      });
    }

    await FormResponse.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Response deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const getResponseStats = async (req, res) => {
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

    const stats = await FormResponse.aggregate([
      { $match: { formId: form._id } },
      {
        $group: {
          _id: null,
          totalResponses: { $sum: 1 },
          averageScore: { $avg: "$totalScore" },
          maxScore: { $max: "$totalScore" },
          minScore: { $min: "$totalScore" },
          averageCompletionTime: { $avg: "$completionTime" },
        },
      },
    ]);

    res.json({
      success: true,
      data: stats[0] || {
        totalResponses: 0,
        averageScore: 0,
        maxScore: 0,
        minScore: 0,
        averageCompletionTime: 0,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Helper functions for scoring answers
const checkCategorizeAnswer = (question, answer) => {
  for (const placement of answer.itemPlacements) {
    const item = question.items.find((i) => i.itemId === placement.itemId);
    if (!item || item.correctCategory !== placement.categoryId) {
      return false;
    }
  }
  return true;
};

const checkClozeAnswer = (question, answer) => {
  for (const blankAnswer of answer.blankAnswers) {
    const blank = question.blanks.find(
      (b) => b.blankId === blankAnswer.blankId
    );
    if (
      !blank ||
      blank.correctAnswer.toLowerCase() !== blankAnswer.userAnswer.toLowerCase()
    ) {
      return false;
    }
  }
  return true;
};

const checkComprehensionAnswer = (question, answer) => {
  for (const subAnswer of answer.subAnswers) {
    const subQuestion = question.subQuestions.find(
      (sq) => sq.subQuestionId === subAnswer.subQuestionId
    );
    if (
      !subQuestion ||
      subQuestion.correctAnswer.toLowerCase() !==
        subAnswer.userAnswer.toLowerCase()
    ) {
      return false;
    }
  }
  return true;
};

module.exports = {
  submitResponse,
  getFormResponses,
  getResponseById,
  deleteResponse,
  getResponseStats,
};
