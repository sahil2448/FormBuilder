import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Box,
  Alert,
} from "@mui/material";

const QUESTION_TYPES = [
  { value: "categorize", label: "Categorize" },
  { value: "cloze", label: "Cloze (Fill in the blanks)" },
  { value: "comprehension", label: "Comprehension" },
];

const AddQuestionDialog = ({ open, onClose, onSubmit, formId }) => {
  const [questionType, setQuestionType] = useState("");
  const [questionText, setQuestionText] = useState("");
  const [points, setPoints] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (!open) {
      setQuestionType("");
      setQuestionText("");
      setPoints(1);
      setError("");
    }
  }, [open]);

  // Inside AddQuestionDialog.jsx

  const handleSubmit = async () => {
    if (!questionType || !questionText.trim()) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const base = {
        questionType,
        questionText: questionText.trim(),
        points: parseInt(points) || 1,
        // order will be set by server based on form.questions length
      };

      let questionData = { ...base };

      switch (questionType) {
        case "categorize": {
          // correctCategory is required in your schema; set to a real categoryId
          const catA = "cat-a";
          const catB = "cat-b";
          questionData = {
            ...base,
            instructions: "Drag and drop items into the correct categories",
            categories: [
              { categoryName: "Category A", categoryId: catA },
              { categoryName: "Category B", categoryId: catB },
            ],
            items: [
              {
                itemText: "Item 1",
                itemId: "item-1",
                correctCategory: catA,
                itemImage: null,
              },
              {
                itemText: "Item 2",
                itemId: "item-2",
                correctCategory: catB,
                itemImage: null,
              },
            ],
          };
          break;
        }

        case "cloze": {
          // Your schema requires: passage, blanks[].position (Number), inputType, options (for dropdown), correctAnswer, placeholder
          questionData = {
            ...base,
            instructions: "Fill in the blanks with the correct answers",
            passage:
              "The capital of France is [[blank-1]] and the capital of Japan is [[blank-2]].",
            blanks: [
              {
                blankId: "blank-1",
                position: 0, // first blank
                inputType: "dropdown",
                options: [
                  { optionText: "Paris", isCorrect: true },
                  { optionText: "Lyon", isCorrect: false },
                  { optionText: "Marseille", isCorrect: false },
                ],
                correctAnswer: "Paris",
                placeholder: "Select city",
              },
              {
                blankId: "blank-2",
                position: 1, // second blank
                inputType: "text", // no options needed for text
                options: [],
                correctAnswer: "Tokyo",
                placeholder: "Type city",
              },
            ],
          };
          break;
        }

        case "comprehension": {
          // Your schema requires: passage (required), subQuestions with required fields
          // questionType in subQuestions is per sub (mcq | short-answer | true-false)
          questionData = {
            ...base,
            instructions:
              "Read the passage carefully and answer the questions below",
            passage:
              "The Earth revolves around the Sun. A year is the time it takes for one complete revolution.",
            passageImage: null,
            subQuestions: [
              {
                subQuestionId: "sq-1",
                questionText: "What does the Earth revolve around?",
                questionType: "mcq",
                options: [
                  { optionText: "The Moon", isCorrect: false },
                  { optionText: "The Sun", isCorrect: true },
                  { optionText: "Mars", isCorrect: false },
                ],
                correctAnswer: "The Sun",
                points: 1,
              },
              {
                subQuestionId: "sq-2",
                questionText:
                  "True or False: One year is the time Earth takes to revolve around the Sun.",
                questionType: "true-false",
                options: [
                  { optionText: "True", isCorrect: true },
                  { optionText: "False", isCorrect: false },
                ],
                correctAnswer: "True",
                points: 1,
              },
              {
                subQuestionId: "sq-3",
                questionText: "Name the planet we live on.",
                questionType: "short-answer",
                options: [],
                correctAnswer: "Earth",
                points: 1,
              },
            ],
          };
          break;
        }
        default:
          break;
      }

      // IMPORTANT: include formId in create payload
      await onSubmit({ ...questionData, formId });
    } catch (err) {
      setError(err.message || "Failed to create question");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add New Question</DialogTitle>
      <DialogContent dividers>
        <Box className="space-y-4">
          {error && <Alert severity="error">{error}</Alert>}

          <FormControl fullWidth required>
            <InputLabel>Question Type</InputLabel>
            <Select
              value={questionType}
              onChange={(e) => setQuestionType(e.target.value)}
              label="Question Type"
              disabled={loading}
            >
              {QUESTION_TYPES.map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  {type.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Question Text"
            multiline
            rows={3}
            fullWidth
            required
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            disabled={loading}
          />

          <TextField
            label="Points"
            type="number"
            fullWidth
            value={points}
            onChange={(e) => setPoints(e.target.value)}
            disabled={loading}
            inputProps={{ min: 1, max: 100 }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || !questionType || !questionText.trim()}
        >
          {loading ? "Creating..." : "Create Question"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddQuestionDialog;
