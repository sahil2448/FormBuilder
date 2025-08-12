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
  Typography,
  Chip,
  Paper,
  Divider,
  IconButton,
  Fade,
  LinearProgress,
} from "@mui/material";
import {
  Close as CloseIcon,
  Quiz as QuizIcon,
  Category as CategoryIcon,
  Edit as EditIcon,
  MenuBook as BookIcon,
} from "@mui/icons-material";

const QUESTION_TYPES = [
  {
    value: "categorize",
    label: "Categorize",
    description: "Drag & drop items into categories",
    icon: <CategoryIcon />,
    color: "#2196f3",
  },
  {
    value: "cloze",
    label: "Cloze (Fill in the blanks)",
    description: "Fill blanks in a passage",
    icon: <EditIcon />,
    color: "#4caf50",
  },
  {
    value: "comprehension",
    label: "Comprehension",
    description: "Answer questions about a passage",
    icon: <BookIcon />,
    color: "#ff9800",
  },
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
      };

      let questionData = { ...base };

      switch (questionType) {
        case "categorize": {
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
          questionData = {
            ...base,
            instructions: "Fill in the blanks with the correct answers",
            passage:
              "The capital of France is [[blank-1]] and the capital of Japan is [[blank-2]].",
            blanks: [
              {
                blankId: "blank-1",
                position: 0,
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
                position: 1,
                inputType: "text",
                options: [],
                correctAnswer: "Tokyo",
                placeholder: "Type city",
              },
            ],
          };
          break;
        }

        case "comprehension": {
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

      await onSubmit({ ...questionData, formId });
    } catch (err) {
      setError(err.message || "Failed to create question");
    } finally {
      setLoading(false);
    }
  };

  const selectedType = QUESTION_TYPES.find(
    (type) => type.value === questionType
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          maxHeight: "90vh",
        },
      }}
    >
      {/* Enhanced Dialog Title */}
      <DialogTitle
        sx={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          py: 2,
        }}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <QuizIcon />
          <Typography variant="h6" fontWeight="bold">
            Add New Question
          </Typography>
        </Box>
        <IconButton
          onClick={onClose}
          disabled={loading}
          sx={{
            color: "white",
            "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* Loading Progress Bar */}
      {loading && (
        <LinearProgress
          sx={{
            height: 3,
            "& .MuiLinearProgress-bar": {
              background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
            },
          }}
        />
      )}

      <DialogContent sx={{ p: 3, backgroundColor: "#fafafa" }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* Error Alert */}
          <Fade in={!!error}>
            <Box>
              {error && (
                <Alert
                  severity="error"
                  sx={{ borderRadius: 2, mb: 2 }}
                  onClose={() => setError("")}
                >
                  {error}
                </Alert>
              )}
            </Box>
          </Fade>

          {/* Question Type Selection */}
          <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Choose Question Type
            </Typography>
            <Box display="flex" flexDirection="column" gap={1.5}>
              {QUESTION_TYPES.map((type) => (
                <Paper
                  key={type.value}
                  elevation={questionType === type.value ? 4 : 1}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    cursor: loading ? "not-allowed" : "pointer",
                    border:
                      questionType === type.value
                        ? `2px solid ${type.color}`
                        : "2px solid transparent",
                    backgroundColor:
                      questionType === type.value ? `${type.color}15` : "white",
                    transition: "all 0.2s ease-in-out",
                    "&:hover": loading
                      ? {}
                      : {
                          elevation: 3,
                          transform: "translateY(-1px)",
                        },
                  }}
                  onClick={() => !loading && setQuestionType(type.value)}
                >
                  <Box display="flex" alignItems="center" gap={2}>
                    <Box
                      sx={{
                        color: type.color,
                        display: "flex",
                        alignItems: "center",
                        fontSize: 24,
                      }}
                    >
                      {type.icon}
                    </Box>
                    <Box flex={1}>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {type.label}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {type.description}
                      </Typography>
                    </Box>
                    {questionType === type.value && (
                      <Chip
                        label="Selected"
                        size="small"
                        sx={{
                          backgroundColor: type.color,
                          color: "white",
                          fontWeight: "bold",
                        }}
                      />
                    )}
                  </Box>
                </Paper>
              ))}
            </Box>
          </Paper>

          {/* Question Details */}
          {selectedType && (
            <Fade in={!!selectedType}>
              <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <Box sx={{ color: selectedType.color, fontSize: 20 }}>
                    {selectedType.icon}
                  </Box>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Question Details
                  </Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />

                <Box display="flex" flexDirection="column" gap={2}>
                  <TextField
                    label="Question Text"
                    multiline
                    rows={4}
                    fullWidth
                    required
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                    disabled={loading}
                    placeholder="Enter your question here..."
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                      },
                    }}
                  />

                  <TextField
                    label="Points"
                    type="number"
                    value={points}
                    onChange={(e) => setPoints(e.target.value)}
                    disabled={loading}
                    inputProps={{ min: 1, max: 100 }}
                    sx={{
                      maxWidth: 150,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                      },
                    }}
                  />
                </Box>
              </Paper>
            </Fade>
          )}
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          p: 3,
          backgroundColor: "#f5f5f5",
          borderTop: "1px solid rgba(0,0,0,0.1)",
        }}
      >
        <Button
          onClick={onClose}
          disabled={loading}
          sx={{ borderRadius: 2, px: 3 }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || !questionType || !questionText.trim()}
          sx={{
            borderRadius: 2,
            px: 3,
            fontWeight: "bold",
            background: selectedType
              ? `linear-gradient(135deg, ${selectedType.color} 0%, ${selectedType.color}dd 100%)`
              : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            "&:hover": {
              background: selectedType
                ? `linear-gradient(135deg, ${selectedType.color}dd 0%, ${selectedType.color}bb 100%)`
                : "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
            },
          }}
        >
          {loading ? "Creating..." : "Create Question"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddQuestionDialog;
