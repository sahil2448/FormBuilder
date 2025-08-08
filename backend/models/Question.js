// models/Question.js
const mongoose = require("mongoose");

// Base Question Schema
const baseQuestionSchema = new mongoose.Schema(
  {
    questionText: {
      type: String,
      required: true,
      maxlength: 1000,
    },
    questionImage: {
      type: String,
      default: null,
    },
    questionType: {
      type: String,
      enum: ["categorize", "cloze", "comprehension"],
      required: true,
    },
    points: {
      type: Number,
      default: 1,
      min: 0,
    },
    isRequired: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      required: true,
    },
  },
  {
    discriminatorKey: "questionType",
    timestamps: true,
  }
);

// Create base Question model
const Question = mongoose.model("Question", baseQuestionSchema);

// 1. Categorize Schema
const categorizeSchema = new mongoose.Schema({
  categories: [
    {
      categoryName: {
        type: String,
        required: true,
        maxlength: 100,
      },
      categoryId: {
        type: String,
        required: true,
      },
    },
  ],
  items: [
    {
      itemText: {
        type: String,
        required: true,
        maxlength: 200,
      },
      itemId: {
        type: String,
        required: true,
      },
      correctCategory: {
        type: String,
        required: true,
      },
      itemImage: {
        type: String,
        default: null,
      },
    },
  ],
  instructions: {
    type: String,
    default: "Drag and drop items into the correct categories",
  },
});

// 2. Cloze Schema
const clozeSchema = new mongoose.Schema({
  passage: {
    type: String,
    required: true,
    maxlength: 2000,
  },
  blanks: [
    {
      blankId: {
        type: String,
        required: true,
      },
      position: {
        type: Number,
        required: true,
      },
      inputType: {
        type: String,
        enum: ["dropdown", "text"],
        default: "dropdown",
      },
      options: [
        {
          optionText: String,
          isCorrect: Boolean,
        },
      ],
      correctAnswer: {
        type: String,
        required: true,
      },
      placeholder: {
        type: String,
        default: "Enter your answer",
      },
    },
  ],
  instructions: {
    type: String,
    default: "Fill in the blanks with the correct answers",
  },
});

// 3. Comprehension Schema
const comprehensionSchema = new mongoose.Schema({
  passage: {
    type: String,
    required: true,
    maxlength: 5000,
  },
  passageImage: {
    type: String,
    default: null,
  },
  subQuestions: [
    {
      subQuestionId: {
        type: String,
        required: true,
      },
      questionText: {
        type: String,
        required: true,
        maxlength: 500,
      },
      questionType: {
        type: String,
        enum: ["mcq", "short-answer", "true-false"],
        required: true,
      },
      options: [
        {
          optionText: String,
          isCorrect: Boolean,
        },
      ],
      correctAnswer: {
        type: String,
        required: true,
      },
      points: {
        type: Number,
        default: 1,
      },
    },
  ],
  instructions: {
    type: String,
    default: "Read the passage carefully and answer the questions below",
  },
});

// Create discriminator models
const CategorizeQuestion = Question.discriminator(
  "categorize",
  categorizeSchema
);
const ClozeQuestion = Question.discriminator("cloze", clozeSchema);
const ComprehensionQuestion = Question.discriminator(
  "comprehension",
  comprehensionSchema
);

// Export all models
module.exports = {
  Question,
  CategorizeQuestion,
  ClozeQuestion,
  ComprehensionQuestion,
};
