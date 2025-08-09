// controllers/formController.js
const Form = require("../models/Form");
const { Question } = require("../models/Question");
const { v4: uuidv4 } = require("uuid");

const createForm = async (req, res) => {
  try {
    const formData = {
      ...req.body,
      createdBy: req.user.id,
      shareableLink: uuidv4(),
    };

    const form = new Form(formData);
    await form.save();

    res.status(201).json({
      success: true,
      message: "Form created successfully",
      data: form,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

const getForms = async (req, res) => {
  try {
    const forms = await Form.find({ createdBy: req.user.id })
      .populate("questions")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: forms,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const getFormById = async (req, res) => {
  try {
    const { id } = req.params;

    const form = await Form.findOne({
      _id: id,
      createdBy: req.user.id,
    }).populate("questions");

    if (!form) {
      return res.status(404).json({
        success: false,
        error: "Form not found",
      });
    }

    res.json({
      success: true,
      data: form,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const updateForm = async (req, res) => {
  try {
    const { id } = req.params;

    const form = await Form.findOneAndUpdate(
      { _id: id, createdBy: req.user.id },
      req.body,
      { new: true, runValidators: true }
    ).populate("questions");

    if (!form) {
      return res.status(404).json({
        success: false,
        error: "Form not found",
      });
    }

    res.json({
      success: true,
      message: "Form updated successfully",
      data: form,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

const deleteForm = async (req, res) => {
  try {
    const { id } = req.params;

    const form = await Form.findOneAndDelete({
      _id: id,
      createdBy: req.user.id,
    });

    if (!form) {
      return res.status(404).json({
        success: false,
        error: "Form not found",
      });
    }

    // Delete all questions associated with this form
    await Question.deleteMany({ _id: { $in: form.questions } });

    res.json({
      success: true,
      message: "Form deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const publishForm = async (req, res) => {
  try {
    const { id } = req.params;

    const form = await Form.findOneAndUpdate(
      { _id: id, createdBy: req.user.id },
      { isPublished: true },
      { new: true }
    ).populate("questions");

    if (!form) {
      return res.status(404).json({
        success: false,
        error: "Form not found",
      });
    }

    res.json({
      success: true,
      message: "Form published successfully",
      data: {
        shareableLink: form.shareableLink,
        form,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const getPublicForm = async (req, res) => {
  try {
    const { shareableLink } = req.params;
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

    res.json({
      success: true,
      data: form,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = {
  createForm,
  getForms,
  getFormById,
  updateForm,
  deleteForm,
  publishForm,
  getPublicForm,
};
