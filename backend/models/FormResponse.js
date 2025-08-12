const mongoose = require("mongoose");
const formResponseSchema = new mongoose.Schema(
  {
    formId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Form",
      required: true,
    },
    respondentEmail: {
      type: String,
      default: null,
    },
    respondentName: {
      type: String,
      default: "Anonymous",
    },
    answers: [
      {
        questionId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Question",
          required: true,
        },
        questionType: {
          type: String,
          enum: ["categorize", "cloze", "comprehension"],
          required: true,
        },
        answer: mongoose.Schema.Types.Mixed,
        isCorrect: Boolean,
        pointsEarned: {
          type: Number,
          default: 0,
        },
        timeSpent: {
          type: Number,
          default: 0,
        },
      },
    ],
    totalScore: {
      type: Number,
      default: 0,
    },
    maxPossibleScore: {
      type: Number,
      required: true,
    },
    completionTime: {
      type: Number,
      default: 0,
    },
    ipAddress: String,
    userAgent: String,
  },
  {
    timestamps: true,
  }
);

const FormResponse = mongoose.model("FormResponse", formResponseSchema);

module.exports = FormResponse;
