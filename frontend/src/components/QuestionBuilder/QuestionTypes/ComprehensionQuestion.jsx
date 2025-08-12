import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  IconButton,
  TextField,
  Typography,
  Alert,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  Tooltip,
  Fade,
  Grid,
} from "@mui/material";
import {
  Add,
  Delete,
  Save,
  MenuBook,
  Quiz,
  CheckCircle,
  RadioButtonUnchecked,
  Image,
} from "@mui/icons-material";

const SUB_TYPES = [
  {
    value: "mcq",
    label: "Multiple Choice",
    icon: "🔘",
    color: "#2196f3",
  },
  {
    value: "short-answer",
    label: "Short Answer",
    icon: "✏️",
    color: "#4caf50",
  },
  {
    value: "true-false",
    label: "True / False",
    icon: "❓",
    color: "#ff9800",
  },
];

function uid(prefix = "id") {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

export default function ComprehensionQuestion({
  initialQuestion = {
    questionType: "comprehension",
    questionText: "Read the passage and answer.",
    instructions: "Read the passage carefully and answer the questions below",
    points: 3,
    passage: "The Earth revolves around the Sun in approximately 365 days.",
    passageImage: null,
    subQuestions: [
      {
        subQuestionId: "sq-1",
        questionText: "What does the Earth revolve around?",
        questionType: "mcq",
        options: [
          { optionText: "The Moon", isCorrect: false },
          { optionText: "The Sun", isCorrect: true },
        ],
        correctAnswer: "The Sun",
        points: 1,
      },
      {
        subQuestionId: "sq-2",
        questionText: "True or False: One year is ~365 days.",
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
  },
  onSave,
  onDelete,
}) {
  const [questionText, setQuestionText] = useState(
    initialQuestion.questionText || ""
  );
  const [instructions, setInstructions] = useState(
    initialQuestion.instructions || ""
  );
  const [points, setPoints] = useState(initialQuestion.points || 1);
  const [passage, setPassage] = useState(initialQuestion.passage || "");
  const [passageImage, setPassageImage] = useState(
    initialQuestion.passageImage || null
  );
  const [subs, setSubs] = useState(initialQuestion.subQuestions || []);
  const [error, setError] = useState("");

  // Ensure each sub has an ID
  useEffect(() => {
    setSubs((prev) =>
      prev.map((sq) => ({
        subQuestionId: sq.subQuestionId || uid("sq"),
        questionText: sq.questionText || "",
        questionType: sq.questionType || "mcq",
        options: Array.isArray(sq.options) ? sq.options : [],
        correctAnswer: sq.correctAnswer || "",
        points: typeof sq.points === "number" ? sq.points : 1,
      }))
    );
  }, []);

  const validate = () => {
    if (!questionText.trim())
      return setError("Question text is required."), false;
    if (!passage.trim()) return setError("Passage is required."), false;
    if (subs.length === 0)
      return setError("Add at least one sub-question."), false;

    for (const [idx, sq] of subs.entries()) {
      if (!sq.questionText || !sq.questionText.trim()) {
        setError(`Sub-question ${idx + 1} text is required.`);
        return false;
      }
      if (
        !sq.questionType ||
        !["mcq", "short-answer", "true-false"].includes(sq.questionType)
      ) {
        setError(`Sub-question ${idx + 1} must have a valid question type.`);
        return false;
      }
      if (sq.points <= 0) {
        setError(`Sub-question ${idx + 1} points must be greater than 0.`);
        return false;
      }
      if (sq.questionType === "mcq") {
        if (!sq.options || sq.options.length < 2) {
          setError(`Sub-question ${idx + 1}: MCQ needs at least 2 options.`);
          return false;
        }
        const hasCorrectInOptions = sq.options.some(
          (o) => o.isCorrect && o.optionText === sq.correctAnswer
        );
        if (!hasCorrectInOptions) {
          setError(
            `Sub-question ${idx + 1}: correctAnswer must match an option marked isCorrect.`
          );
          return false;
        }
      }
      if (sq.questionType === "true-false") {
        const labels = (sq.options || []).map((o) =>
          (o.optionText || "").toLowerCase()
        );
        const hasTrue = labels.includes("true");
        const hasFalse = labels.includes("false");
        if (!hasTrue || !hasFalse) {
          setError(
            `Sub-question ${idx + 1}: true-false must have options "True" and "False".`
          );
          return false;
        }
        if (!["True", "False"].includes(sq.correctAnswer)) {
          setError(
            `Sub-question ${idx + 1}: correctAnswer must be "True" or "False".`
          );
          return false;
        }
      }
      if (sq.questionType === "short-answer") {
        if (!sq.correctAnswer || !sq.correctAnswer.trim()) {
          setError(
            `Sub-question ${idx + 1}: provide a correctAnswer for short-answer.`
          );
          return false;
        }
      }
    }

    return true;
  };

  const handleSave = async () => {
    setError("");
    if (!validate()) return;
    const payload = {
      questionType: "comprehension",
      questionText: questionText.trim(),
      points: Number(points) || 1,
      instructions: instructions.trim(),
      passage,
      passageImage: passageImage || null,
      subQuestions: subs.map((sq) => ({
        subQuestionId: sq.subQuestionId,
        questionText: sq.questionText.trim(),
        questionType: sq.questionType,
        options:
          sq.questionType === "short-answer"
            ? []
            : (sq.options || []).map((o) => ({
                optionText: o.optionText || "",
                isCorrect: !!o.isCorrect,
              })),
        correctAnswer: sq.correctAnswer,
        points: Number(sq.points) || 1,
      })),
    };
    await onSave?.(payload);
  };

  const addSub = (type = "mcq") => {
    const id = uid("sq");
    const base = {
      subQuestionId: id,
      questionText: "",
      questionType: type,
      options: [],
      correctAnswer: "",
      points: 1,
    };
    if (type === "true-false") {
      base.options = [
        { optionText: "True", isCorrect: false },
        { optionText: "False", isCorrect: false },
      ];
      base.correctAnswer = "True";
    }
    if (type === "mcq") {
      base.options = [
        { optionText: "Option 1", isCorrect: true },
        { optionText: "Option 2", isCorrect: false },
      ];
      base.correctAnswer = "Option 1";
    }
    setSubs((prev) => [...prev, base]);
  };

  const deleteSub = (subQuestionId) => {
    setSubs((prev) => prev.filter((s) => s.subQuestionId !== subQuestionId));
  };

  const setSubField = (id, field, value) => {
    setSubs((prev) =>
      prev.map((s) => (s.subQuestionId === id ? { ...s, [field]: value } : s))
    );
  };

  const addOption = (id) => {
    setSubs((prev) =>
      prev.map((s) =>
        s.subQuestionId === id
          ? {
              ...s,
              options: [
                ...(s.options || []),
                { optionText: "", isCorrect: false },
              ],
            }
          : s
      )
    );
  };

  const setOptionField = (id, idx, field, value) => {
    setSubs((prev) =>
      prev.map((s) => {
        if (s.subQuestionId !== id) return s;
        const opts = [...(s.options || [])];
        opts[idx] = { ...opts[idx], [field]: value };
        return { ...s, options: opts };
      })
    );
  };

  const deleteOption = (id, idx) => {
    setSubs((prev) =>
      prev.map((s) => {
        if (s.subQuestionId !== id) return s;
        const opts = (s.options || []).filter((_, i) => i !== idx);
        return { ...s, options: opts };
      })
    );
  };

  const getSubTypeInfo = (type) => SUB_TYPES.find((t) => t.value === type);
  const totalSubPoints = subs.reduce((sum, sq) => sum + (sq.points || 0), 0);

  return (
    <Paper
      elevation={2}
      sx={{ p: 3, borderRadius: 3, backgroundColor: "#fafafa" }}
    >
      <Box display="flex" alignItems="center" gap={1} mb={3}>
        <MenuBook sx={{ color: "#ff9800", fontSize: 28 }} />
        <Typography variant="h6" fontWeight="bold" sx={{ color: "#ff9800" }}>
          Comprehension Question Editor
        </Typography>
        <Chip
          label="Reading & Analysis"
          size="small"
          sx={{
            backgroundColor: "#ff9800",
            color: "white",
            fontWeight: "bold",
          }}
        />
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mb: 4 }}>
        <Fade in={!!error}>
          <Box>
            {error && (
              <Alert
                severity="error"
                sx={{ borderRadius: 2 }}
                onClose={() => setError("")}
              >
                {error}
              </Alert>
            )}
          </Box>
        </Fade>

        <TextField
          label="Question Title"
          fullWidth
          multiline
          rows={3}
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
            },
          }}
        />

        <Box display="flex" gap={2}>
          <TextField
            label="Total Points"
            type="number"
            sx={{ maxWidth: 150 }}
            value={points}
            onChange={(e) => setPoints(e.target.value)}
            inputProps={{ min: 0 }}
            InputProps={{
              sx: { borderRadius: 2 },
            }}
            helperText={`Sub-questions total: ${totalSubPoints}`}
          />
          <TextField
            label="Instructions"
            fullWidth
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
          />
        </Box>
      </Box>

      {/* Enhanced Passage Section */}
      <Paper
        elevation={3}
        sx={{
          mb: 3,
          borderRadius: 3,
          border: "2px solid rgba(255, 152, 0, 0.2)",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            p: 2,
            background: "linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)",
            color: "white",
          }}
        >
          <Box display="flex" alignItems="center" gap={1}>
            <MenuBook sx={{ fontSize: 20 }} />
            <Typography variant="subtitle1" fontWeight="bold">
              Reading Passage
            </Typography>
          </Box>
        </Box>

        <CardContent sx={{ p: 3 }}>
          <TextField
            label="Passage Text"
            fullWidth
            multiline
            minRows={6}
            value={passage}
            onChange={(e) => setPassage(e.target.value)}
            sx={{
              mb: 3,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
          />

          <Box display="flex" alignItems="center" gap={2}>
            <Image sx={{ color: "#ff9800" }} />
            <TextField
              label="Passage Image URL (optional)"
              value={passageImage || ""}
              onChange={(e) => setPassageImage(e.target.value)}
              placeholder="https://example.com/image.jpg"
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
            />
          </Box>
        </CardContent>
      </Paper>

      <Paper
        elevation={3}
        sx={{
          mb: 3,
          borderRadius: 3,
          border: "2px solid rgba(255, 152, 0, 0.2)",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            p: 2,
            background: "linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)",
            color: "white",
          }}
        >
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box display="flex" alignItems="center" gap={1}>
              <Quiz sx={{ fontSize: 20 }} />
              <Typography variant="subtitle1" fontWeight="bold">
                Sub-Questions ({subs.length})
              </Typography>
              <Chip
                size="small"
                label={`${totalSubPoints} pts total`}
                sx={{
                  backgroundColor: "rgba(255,255,255,0.2)",
                  color: "white",
                  fontWeight: "bold",
                }}
              />
            </Box>
            <Box display="flex" gap={1} flexWrap="wrap">
              {SUB_TYPES.map((type) => (
                <Tooltip key={type.value} title={`Add ${type.label}`}>
                  <Button
                    size="small"
                    variant="contained"
                    onClick={() => addSub(type.value)}
                    sx={{
                      backgroundColor: "rgba(255,255,255,0.2)",
                      color: "white",
                      fontWeight: "bold",
                      minWidth: "auto",
                      "&:hover": {
                        backgroundColor: "rgba(255,255,255,0.3)",
                      },
                    }}
                  >
                    {type.icon}
                  </Button>
                </Tooltip>
              ))}
            </Box>
          </Box>
        </Box>

        <CardContent sx={{ p: 3 }}>
          {subs.length === 0 ? (
            <Alert
              severity="info"
              sx={{ borderRadius: 2, textAlign: "center" }}
            >
              <Typography variant="h6" sx={{ mb: 1 }}>
                📝 No sub-questions yet
              </Typography>
              <Typography variant="body2">
                Add MCQ, True/False, or Short Answer questions using the buttons
                above.
              </Typography>
            </Alert>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {subs.map((sq, idx) => {
                const typeInfo = getSubTypeInfo(sq.questionType);
                return (
                  <Paper
                    key={sq.subQuestionId}
                    elevation={2}
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      border: `2px solid ${typeInfo?.color}20`,
                      "&:hover": {
                        boxShadow: 4,
                        borderColor: `${typeInfo?.color}60`,
                      },
                      transition: "all 0.3s ease-in-out",
                    }}
                  >
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      mb={3}
                    >
                      <Box display="flex" alignItems="center" gap={2}>
                        <Chip
                          label={`Q${idx + 1}`}
                          sx={{
                            backgroundColor: typeInfo?.color,
                            color: "white",
                            fontWeight: "bold",
                          }}
                        />
                        <FormControl size="small" sx={{ minWidth: 200 }}>
                          <InputLabel>Question Type</InputLabel>
                          <Select
                            label="Question Type"
                            value={sq.questionType}
                            onChange={(e) =>
                              setSubField(
                                sq.subQuestionId,
                                "questionType",
                                e.target.value
                              )
                            }
                            sx={{ borderRadius: 2 }}
                          >
                            {SUB_TYPES.map((t) => (
                              <MenuItem key={t.value} value={t.value}>
                                {t.icon} {t.label}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Box>
                      <Tooltip title="Delete sub-question">
                        <IconButton
                          size="small"
                          onClick={() => deleteSub(sq.subQuestionId)}
                          sx={{
                            color: "error.main",
                            "&:hover": { backgroundColor: "error.50" },
                          }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>

                    <Grid container spacing={2} sx={{ mb: 3 }}>
                      <Grid item xs={12} md={8}>
                        <TextField
                          label="Sub-question Text"
                          value={sq.questionText}
                          onChange={(e) =>
                            setSubField(
                              sq.subQuestionId,
                              "questionText",
                              e.target.value
                            )
                          }
                          fullWidth
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 2,
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <TextField
                          label="Points"
                          type="number"
                          value={sq.points}
                          onChange={(e) =>
                            setSubField(
                              sq.subQuestionId,
                              "points",
                              Number(e.target.value)
                            )
                          }
                          inputProps={{ min: 1 }}
                          fullWidth
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 2,
                            },
                          }}
                        />
                      </Grid>
                    </Grid>

                    {sq.questionType === "mcq" && (
                      <Paper
                        elevation={1}
                        sx={{
                          p: 2,
                          mb: 2,
                          backgroundColor: "#f8f9fa",
                          borderRadius: 2,
                          border: `1px dashed ${typeInfo?.color}`,
                        }}
                      >
                        <Box
                          display="flex"
                          alignItems="center"
                          justifyContent="space-between"
                          mb={2}
                        >
                          <Typography variant="subtitle2" fontWeight="bold">
                            Multiple Choice Options
                          </Typography>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => addOption(sq.subQuestionId)}
                            startIcon={<Add />}
                            sx={{
                              borderColor: typeInfo?.color,
                              color: typeInfo?.color,
                              borderRadius: 2,
                              "&:hover": {
                                backgroundColor: `${typeInfo?.color}10`,
                              },
                            }}
                          >
                            Add Option
                          </Button>
                        </Box>

                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                          }}
                        >
                          {(sq.options || []).map((opt, oIdx) => (
                            <Box
                              key={oIdx}
                              display="flex"
                              alignItems="center"
                              gap={2}
                              sx={{
                                p: 1.5,
                                backgroundColor: opt.isCorrect
                                  ? `${typeInfo?.color}20`
                                  : "white",
                                borderRadius: 2,
                                border: opt.isCorrect
                                  ? `2px solid ${typeInfo?.color}`
                                  : "1px solid #e0e0e0",
                              }}
                            >
                              <TextField
                                label={`Option ${oIdx + 1}`}
                                value={opt.optionText || ""}
                                onChange={(e) =>
                                  setOptionField(
                                    sq.subQuestionId,
                                    oIdx,
                                    "optionText",
                                    e.target.value
                                  )
                                }
                                sx={{
                                  flex: 1,
                                  "& .MuiOutlinedInput-root": {
                                    borderRadius: 2,
                                  },
                                }}
                              />

                              <Tooltip
                                title={
                                  opt.isCorrect
                                    ? "Correct answer"
                                    : "Mark as correct"
                                }
                              >
                                <IconButton
                                  onClick={() =>
                                    setOptionField(
                                      sq.subQuestionId,
                                      oIdx,
                                      "isCorrect",
                                      !opt.isCorrect
                                    )
                                  }
                                  sx={{
                                    color: opt.isCorrect
                                      ? typeInfo?.color
                                      : "grey.400",
                                  }}
                                >
                                  {opt.isCorrect ? (
                                    <CheckCircle />
                                  ) : (
                                    <RadioButtonUnchecked />
                                  )}
                                </IconButton>
                              </Tooltip>

                              <Tooltip title="Delete option">
                                <IconButton
                                  size="small"
                                  onClick={() =>
                                    deleteOption(sq.subQuestionId, oIdx)
                                  }
                                  sx={{
                                    color: "error.main",
                                    "&:hover": { backgroundColor: "error.50" },
                                  }}
                                >
                                  <Delete fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          ))}
                        </Box>

                        <TextField
                          label="Correct Answer (must match a correct option)"
                          fullWidth
                          value={sq.correctAnswer || ""}
                          onChange={(e) =>
                            setSubField(
                              sq.subQuestionId,
                              "correctAnswer",
                              e.target.value
                            )
                          }
                          sx={{
                            mt: 2,
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 2,
                            },
                          }}
                        />
                      </Paper>
                    )}

                    {sq.questionType === "true-false" && (
                      <Paper
                        elevation={1}
                        sx={{
                          p: 2,
                          mb: 2,
                          backgroundColor: "#f8f9fa",
                          borderRadius: 2,
                          border: `1px dashed ${typeInfo?.color}`,
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          fontWeight="bold"
                          sx={{ mb: 2 }}
                        >
                          True/False Options
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                            mb: 2,
                          }}
                        >
                          {(sq.options || []).map((opt, oIdx) => (
                            <Box
                              key={oIdx}
                              display="flex"
                              alignItems="center"
                              gap={2}
                              sx={{
                                p: 1.5,
                                backgroundColor: opt.isCorrect
                                  ? `${typeInfo?.color}20`
                                  : "white",
                                borderRadius: 2,
                                border: opt.isCorrect
                                  ? `2px solid ${typeInfo?.color}`
                                  : "1px solid #e0e0e0",
                              }}
                            >
                              <TextField
                                label={`Option ${oIdx + 1}`}
                                value={opt.optionText || ""}
                                onChange={(e) =>
                                  setOptionField(
                                    sq.subQuestionId,
                                    oIdx,
                                    "optionText",
                                    e.target.value
                                  )
                                }
                                sx={{
                                  flex: 1,
                                  "& .MuiOutlinedInput-root": {
                                    borderRadius: 2,
                                  },
                                }}
                              />

                              <Tooltip
                                title={
                                  opt.isCorrect
                                    ? "Correct answer"
                                    : "Mark as correct"
                                }
                              >
                                <IconButton
                                  onClick={() =>
                                    setOptionField(
                                      sq.subQuestionId,
                                      oIdx,
                                      "isCorrect",
                                      !opt.isCorrect
                                    )
                                  }
                                  sx={{
                                    color: opt.isCorrect
                                      ? typeInfo?.color
                                      : "grey.400",
                                  }}
                                >
                                  {opt.isCorrect ? (
                                    <CheckCircle />
                                  ) : (
                                    <RadioButtonUnchecked />
                                  )}
                                </IconButton>
                              </Tooltip>
                            </Box>
                          ))}
                        </Box>

                        <TextField
                          label='Correct Answer ("True" or "False")'
                          fullWidth
                          value={sq.correctAnswer || ""}
                          onChange={(e) =>
                            setSubField(
                              sq.subQuestionId,
                              "correctAnswer",
                              e.target.value
                            )
                          }
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 2,
                            },
                          }}
                        />
                      </Paper>
                    )}

                    {sq.questionType === "short-answer" && (
                      <Paper
                        elevation={1}
                        sx={{
                          p: 2,
                          mb: 2,
                          backgroundColor: "#f8f9fa",
                          borderRadius: 2,
                          border: `1px dashed ${typeInfo?.color}`,
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          fontWeight="bold"
                          sx={{ mb: 2 }}
                        >
                          Short Answer Configuration
                        </Typography>
                        <TextField
                          label="Correct Answer"
                          fullWidth
                          value={sq.correctAnswer || ""}
                          onChange={(e) =>
                            setSubField(
                              sq.subQuestionId,
                              "correctAnswer",
                              e.target.value
                            )
                          }
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 2,
                            },
                          }}
                          helperText="This will be used for exact text matching"
                        />
                      </Paper>
                    )}
                  </Paper>
                );
              })}
            </Box>
          )}
        </CardContent>
      </Paper>

      <Box display="flex" flexWrap="wrap" gap={2}>
        <Button
          variant="contained"
          onClick={handleSave}
          startIcon={<Save />}
          sx={{
            borderRadius: 2,
            px: 3,
            fontWeight: "bold",
            background: "linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)",
            "&:hover": {
              background: "linear-gradient(135deg, #f57c00 0%, #ffb74d 100%)",
            },
          }}
        >
          Save Question
        </Button>
        <Button
          color="error"
          onClick={onDelete}
          startIcon={<Delete />}
          sx={{
            borderRadius: 2,
            px: 3,
            fontWeight: "bold",
          }}
        >
          Delete Question
        </Button>
      </Box>
    </Paper>
  );
}
