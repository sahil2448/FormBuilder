import React, { useEffect, useMemo, useState } from "react";
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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Paper,
  Tooltip,
  Fade,
  Switch,
  FormControlLabel,
} from "@mui/material";
import {
  Add,
  Delete,
  Save,
  TextFields,
  Visibility,
  Edit,
  CheckCircle,
  RadioButtonUnchecked,
} from "@mui/icons-material";

function parseMarkers(passage) {
  const regex = /\[\[blank-([a-zA-Z0-9_-]+)\]\]/g;
  const ids = [];
  let m;
  while ((m = regex.exec(passage)) !== null) ids.push(`blank-${m[1]}`);
  return ids;
}

export default function ClozeQuestion({
  initialQuestion = {
    questionType: "cloze",
    questionText: "Fill in the blanks.",
    instructions: "Fill in the blanks with the correct answers",
    points: 5,
    passage: "The capital of France is [[blank-1]].",
    blanks: [
      {
        blankId: "blank-1",
        position: 0,
        inputType: "dropdown",
        options: [
          { optionText: "Paris", isCorrect: true },
          { optionText: "Lyon", isCorrect: false },
        ],
        correctAnswer: "Paris",
        placeholder: "Select city",
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
  const [blanks, setBlanks] = useState(initialQuestion.blanks || []);
  const [error, setError] = useState("");

  const markerIds = useMemo(() => parseMarkers(passage), [passage]);

  useEffect(() => {
    setBlanks((prev) => {
      const prevMap = new Map(prev.map((b) => [b.blankId, b]));
      const updated = markerIds.map((blankId, idx) => {
        const existing = prevMap.get(blankId);
        return existing
          ? { ...existing, position: idx }
          : {
              blankId,
              position: idx,
              inputType: "dropdown",
              options: [],
              correctAnswer: "",
              placeholder: "Enter your answer",
            };
      });
      return updated;
    });
  }, [markerIds]);

  const validate = () => {
    if (!questionText.trim())
      return setError("Question text is required."), false;
    if (!passage.trim()) return setError("Passage is required."), false;
    if (markerIds.length === 0)
      return setError("Add at least one blank marker like [[blank-1]]."), false;
    for (const b of blanks) {
      if (!b.correctAnswer || !b.correctAnswer.trim()) {
        setError(`Provide a correct answer for ${b.blankId}.`);
        return false;
      }
      if (b.inputType === "dropdown") {
        if (!b.options || b.options.length === 0) {
          setError(
            `Add at least one option for ${b.blankId} or switch to text input.`
          );
          return false;
        }
        const hasCorrect = b.options.some(
          (o) => o.isCorrect && o.optionText === b.correctAnswer
        );
        if (!hasCorrect) {
          setError(
            `Correct answer must match one of the options for ${b.blankId}.`
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
      questionType: "cloze",
      questionText: questionText.trim(),
      points: Number(points) || 1,
      instructions: instructions.trim(),
      passage,
      blanks: blanks
        .slice()
        .sort((a, b) => (a.position || 0) - (b.position || 0))
        .map((b) => ({
          blankId: b.blankId,
          position: b.position,
          inputType: b.inputType,
          options: b.inputType === "dropdown" ? b.options || [] : [],
          correctAnswer: b.correctAnswer,
          placeholder: b.placeholder || "Enter your answer",
        })),
    };
    await onSave?.(payload);
  };

  const addMarkerToPassage = () => {
    const existingNums = new Set(
      markerIds
        .map((id) => id.replace(/^blank-/, ""))
        .map((v) => (isNaN(+v) ? null : +v))
        .filter((v) => v !== null)
    );
    let n = 1;
    while (existingNums.has(n)) n += 1;
    const token = `[[blank-${n}]]`;
    setPassage((prev) => (prev ? `${prev} ${token}` : token));
  };

  const removeMarker = (blankId) => {
    const safe = blankId.replace(/^blank-/, "");
    const regex = new RegExp(`\\[\\[blank-${safe}\\]\\]`, "g");
    setPassage((prev) =>
      prev
        .replace(regex, "")
        .replace(/\s{2,}/g, " ")
        .trim()
    );
  };

  const setBlankField = (blankId, field, value) => {
    setBlanks((prev) =>
      prev.map((b) => (b.blankId === blankId ? { ...b, [field]: value } : b))
    );
  };

  const addOption = (blankId) => {
    setBlanks((prev) =>
      prev.map((b) =>
        b.blankId === blankId
          ? {
              ...b,
              options: [
                ...(b.options || []),
                { optionText: "", isCorrect: false },
              ],
            }
          : b
      )
    );
  };

  const setOptionField = (blankId, idx, field, value) => {
    setBlanks((prev) =>
      prev.map((b) => {
        if (b.blankId !== blankId) return b;
        const opts = [...(b.options || [])];
        opts[idx] = { ...opts[idx], [field]: value };
        return { ...b, options: opts };
      })
    );
  };

  const deleteOption = (blankId, idx) => {
    setBlanks((prev) =>
      prev.map((b) => {
        if (b.blankId !== blankId) return b;
        const opts = (b.options || []).filter((_, i) => i !== idx);
        return { ...b, options: opts };
      })
    );
  };

  const renderPassagePreview = () => {
    if (!passage) return null;
    const parts = [];
    const regex = /\[\[blank-([a-zA-Z0-9_-]+)\]\]/g;
    let lastIndex = 0;
    let m;
    let idx = 0;
    while ((m = regex.exec(passage)) !== null) {
      const start = m.index;
      const end = regex.lastIndex;
      const before = passage.slice(lastIndex, start);
      if (before)
        parts.push(<span key={`text-${idx}-${start}`}>{before}</span>);
      const blankId = `blank-${m[1]}`;
      const blank = blanks.find((b) => b.blankId === blankId);
      parts.push(
        <TextField
          key={`blank-${idx}-${blankId}`}
          size="small"
          placeholder={blank?.placeholder || `Blank ${idx + 1}`}
          disabled
          sx={{
            mx: 0.5,
            width: 160,
            "& .MuiOutlinedInput-root": {
              backgroundColor: "#e3f2fd",
              borderRadius: 2,
            },
          }}
        />
      );
      lastIndex = end;
      idx += 1;
    }
    const after = passage.slice(lastIndex);
    if (after) parts.push(<span key={`text-end`}>{after}</span>);
    return (
      <Typography variant="body1" component="div" sx={{ lineHeight: 2 }}>
        {parts}
      </Typography>
    );
  };

  return (
    <Paper
      elevation={2}
      sx={{ p: 3, borderRadius: 3, backgroundColor: "#fafafa" }}
    >
      <Box display="flex" alignItems="center" gap={1} mb={3}>
        <TextFields sx={{ color: "#4caf50", fontSize: 28 }} />
        <Typography variant="h6" fontWeight="bold" sx={{ color: "#4caf50" }}>
          Cloze Question Editor
        </Typography>
        <Chip
          label="Fill in the Blanks"
          size="small"
          sx={{
            backgroundColor: "#4caf50",
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
          label="Question Text"
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
            label="Points"
            type="number"
            sx={{ maxWidth: 150 }}
            value={points}
            onChange={(e) => setPoints(e.target.value)}
            inputProps={{ min: 1 }}
            InputProps={{
              sx: { borderRadius: 2 },
            }}
          />
          <TextField
            label="Instructions (optional)"
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
          border: "2px solid rgba(76, 175, 80, 0.2)",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            p: 2,
            background: "linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)",
            color: "white",
          }}
        >
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box display="flex" alignItems="center" gap={1}>
              <Edit sx={{ fontSize: 20 }} />
              <Typography variant="subtitle1" fontWeight="bold">
                Passage Editor
              </Typography>
              <Chip
                size="small"
                label={`${markerIds.length} blanks`}
                sx={{
                  backgroundColor: "rgba(255,255,255,0.2)",
                  color: "white",
                  fontWeight: "bold",
                }}
              />
            </Box>
            <Tooltip title="Insert new blank marker">
              <Button
                size="small"
                variant="contained"
                onClick={addMarkerToPassage}
                startIcon={<Add />}
                sx={{
                  backgroundColor: "rgba(255,255,255,0.2)",
                  color: "white",
                  fontWeight: "bold",
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.3)",
                  },
                }}
              >
                Insert Blank
              </Button>
            </Tooltip>
          </Box>
        </Box>

        <CardContent sx={{ p: 3 }}>
          <TextField
            label="Passage (use markers like [[blank-1]], [[blank-2]])"
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

          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <Visibility sx={{ color: "#4caf50" }} />
            <Typography variant="subtitle2" fontWeight="bold">
              Live Preview
            </Typography>
          </Box>
          <Paper
            elevation={1}
            sx={{
              p: 3,
              backgroundColor: "#f8f9fa",
              borderRadius: 2,
              border: "2px dashed #4caf50",
            }}
          >
            {renderPassagePreview()}
          </Paper>
        </CardContent>
      </Paper>

      <Paper
        elevation={3}
        sx={{
          mb: 3,
          borderRadius: 3,
          border: "2px solid rgba(76, 175, 80, 0.2)",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            p: 2,
            background: "linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)",
            color: "white",
          }}
        >
          <Box display="flex" alignItems="center" gap={1}>
            <TextFields sx={{ fontSize: 20 }} />
            <Typography variant="subtitle1" fontWeight="bold">
              Blank Configuration ({markerIds.length})
            </Typography>
          </Box>
        </Box>

        <CardContent sx={{ p: 3 }}>
          {blanks.length === 0 ? (
            <Alert severity="info" sx={{ borderRadius: 2 }}>
              Add blank markers like [[blank-1]] in your passage to configure
              them here.
            </Alert>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {blanks
                .slice()
                .sort((a, b) => (a.position || 0) - (b.position || 0))
                .map((b, i) => (
                  <Paper
                    key={b.blankId}
                    elevation={2}
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      border: "1px solid rgba(76, 175, 80, 0.3)",
                      "&:hover": {
                        boxShadow: 4,
                        borderColor: "#4caf50",
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
                          label={`Blank ${i + 1}`}
                          sx={{
                            backgroundColor: "#4caf50",
                            color: "white",
                            fontWeight: "bold",
                          }}
                        />
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          fontFamily="monospace"
                        >
                          ID: {b.blankId}
                        </Typography>
                      </Box>
                      <Tooltip title="Remove this blank marker from passage">
                        <IconButton
                          size="small"
                          onClick={() => removeMarker(b.blankId)}
                          sx={{
                            color: "error.main",
                            "&:hover": { backgroundColor: "error.50" },
                          }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>

                    <Box
                      display="flex"
                      flexDirection={{ xs: "column", md: "row" }}
                      gap={2}
                      mb={3}
                    >
                      <FormControl sx={{ minWidth: 200 }}>
                        <InputLabel>Input Type</InputLabel>
                        <Select
                          label="Input Type"
                          value={b.inputType || "dropdown"}
                          onChange={(e) =>
                            setBlankField(
                              b.blankId,
                              "inputType",
                              e.target.value
                            )
                          }
                          sx={{ borderRadius: 2 }}
                        >
                          <MenuItem value="dropdown">📋 Dropdown</MenuItem>
                          <MenuItem value="text">✏️ Text Input</MenuItem>
                        </Select>
                      </FormControl>

                      <TextField
                        label="Placeholder Text"
                        fullWidth
                        value={b.placeholder || ""}
                        onChange={(e) =>
                          setBlankField(
                            b.blankId,
                            "placeholder",
                            e.target.value
                          )
                        }
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                          },
                        }}
                      />
                    </Box>

                    {b.inputType === "dropdown" && (
                      <Paper
                        elevation={1}
                        sx={{
                          p: 2,
                          mb: 3,
                          backgroundColor: "#f8f9fa",
                          borderRadius: 2,
                          border: "1px dashed #4caf50",
                        }}
                      >
                        <Box
                          display="flex"
                          alignItems="center"
                          justifyContent="space-between"
                          mb={2}
                        >
                          <Typography variant="subtitle2" fontWeight="bold">
                            Dropdown Options
                          </Typography>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => addOption(b.blankId)}
                            startIcon={<Add />}
                            sx={{
                              borderColor: "#4caf50",
                              color: "#4caf50",
                              borderRadius: 2,
                              "&:hover": {
                                backgroundColor: "rgba(76, 175, 80, 0.1)",
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
                          {(b.options || []).map((opt, idx) => (
                            <Box
                              key={idx}
                              display="flex"
                              alignItems="center"
                              gap={2}
                              sx={{
                                p: 1.5,
                                backgroundColor: opt.isCorrect
                                  ? "rgba(76, 175, 80, 0.1)"
                                  : "white",
                                borderRadius: 2,
                                border: opt.isCorrect
                                  ? "2px solid #4caf50"
                                  : "1px solid #e0e0e0",
                              }}
                            >
                              <TextField
                                label={`Option ${idx + 1}`}
                                value={opt.optionText || ""}
                                onChange={(e) =>
                                  setOptionField(
                                    b.blankId,
                                    idx,
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
                                      b.blankId,
                                      idx,
                                      "isCorrect",
                                      !opt.isCorrect
                                    )
                                  }
                                  sx={{
                                    color: opt.isCorrect
                                      ? "#4caf50"
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
                                  onClick={() => deleteOption(b.blankId, idx)}
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
                      </Paper>
                    )}

                    <TextField
                      label="Correct Answer"
                      fullWidth
                      value={b.correctAnswer || ""}
                      onChange={(e) =>
                        setBlankField(
                          b.blankId,
                          "correctAnswer",
                          e.target.value
                        )
                      }
                      helperText={
                        b.inputType === "dropdown"
                          ? "Must match one of the options marked as correct"
                          : "Exact text match (case-sensitive)"
                      }
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                        },
                      }}
                    />
                  </Paper>
                ))}
            </Box>
          )}
        </CardContent>
      </Paper>

      {/* Action Buttons */}
      <Box display="flex" flexWrap="wrap" gap={2}>
        <Button
          variant="contained"
          onClick={handleSave}
          startIcon={<Save />}
          sx={{
            borderRadius: 2,
            px: 3,
            fontWeight: "bold",
            background: "linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)",
            "&:hover": {
              background: "linear-gradient(135deg, #45a049 0%, #5cb85c 100%)",
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
