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

const AddQuestionDialog = ({ open, onClose, onSubmit }) => {
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

  const handleSubmit = async () => {
    if (!questionType || !questionText.trim()) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const questionData = {
        questionType,
        questionText: questionText.trim(),
        points: parseInt(points),
        order: 1,
      };

      switch (questionType) {
        case "categorize":
          questionData.categories = [];
          questionData.items = [];
          questionData.instructions = "";
          break;
        case "cloze":
          questionData.blanks = [];
          break;
        case "comprehension":
          questionData.passage = "";
          questionData.options = [];
          questionData.correctAnswers = [];
          break;
      }

      await onSubmit(questionData);
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
