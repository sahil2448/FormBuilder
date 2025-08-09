const { default: mongoose } = require("mongoose");

const formSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      maxlength: 200,
    },
    description: {
      type: String,
      maxlength: 1000,
    },
    headerImage: {
      type: String,
      default: null,
    },
    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    shareableLink: {
      type: String,
      unique: true,
    },
    settings: {
      allowAnonymous: { type: Boolean, default: true },
      collectEmail: { type: Boolean, default: false },
      showResults: { type: Boolean, default: false },
    },
  },
  {
    timestamps: true,
  }
);

const Form = mongoose.model("Form", formSchema);

module.exports = Form;
