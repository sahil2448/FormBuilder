// src/components/QuestionBuilder/QuestionTypes/ClozeQuestion.jsx
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
} from "@mui/material";
import { Add, Delete, Save } from "@mui/icons-material";

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
          placeholder={blank?.placeholder || `Blank`}
          disabled
          sx={{ mx: 0.5, width: 160 }}
        />
      );
      lastIndex = end;
      idx += 1;
    }
    const after = passage.slice(lastIndex);
    if (after) parts.push(<span key={`text-end`}>{after}</span>);
    return (
      <Typography variant="body1" component="div">
        {parts}
      </Typography>
    );
  };

  return (
    <Box className="space-y-4">
      {error && <Alert severity="error">{error}</Alert>}

      <TextField
        label="Question Text"
        fullWidth
        multiline
        rows={2}
        value={questionText}
        onChange={(e) => setQuestionText(e.target.value)}
      />

      <Box className="flex gap-4">
        <TextField
          label="Points"
          type="number"
          sx={{ maxWidth: 140 }}
          value={points}
          onChange={(e) => setPoints(e.target.value)}
          inputProps={{ min: 1 }}
        />
        <TextField
          label="Instructions (optional)"
          fullWidth
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
        />
      </Box>

      <Card variant="outlined">
        <CardContent>
          <Box className="flex items-center justify-between mb-3">
            <Typography variant="subtitle1" fontWeight="600">
              Passage (use markers like [[blank-1]], [[blank-2]])
            </Typography>
            <Button
              size="small"
              variant="outlined"
              onClick={addMarkerToPassage}
              startIcon={<Add />}
            >
              Insert Blank Marker
            </Button>
          </Box>
          <TextField
            label="Passage"
            fullWidth
            multiline
            minRows={6}
            value={passage}
            onChange={(e) => setPassage(e.target.value)}
          />
          <Box className="mt-3">
            <Typography variant="subtitle2" className="mb-1">
              Live Preview
            </Typography>
            <Card variant="outlined" sx={{ p: 2, backgroundColor: "#fafafa" }}>
              {renderPassagePreview()}
            </Card>
          </Box>
        </CardContent>
      </Card>

      <Card variant="outlined">
        <CardContent>
          <Typography variant="subtitle1" fontWeight="600" className="mb-2">
            Blanks ({markerIds.length})
          </Typography>
          <Divider className="my-2" />
          <Box className="space-y-3">
            {blanks
              .slice()
              .sort((a, b) => (a.position || 0) - (b.position || 0))
              .map((b, i) => (
                <Card key={b.blankId} variant="outlined">
                  <CardContent>
                    <Box className="flex items-center justify-between mb-2">
                      <Box className="flex items-center gap-2">
                        <Chip size="small" label={`Blank ${i + 1}`} />
                        <Typography variant="body2" color="text.secondary">
                          ID: {b.blankId}
                        </Typography>
                      </Box>
                      <IconButton
                        size="small"
                        onClick={() => removeMarker(b.blankId)}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>

                    <Box className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                      <FormControl fullWidth>
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
                        >
                          <MenuItem value="dropdown">Dropdown</MenuItem>
                          <MenuItem value="text">Text</MenuItem>
                        </Select>
                      </FormControl>

                      <TextField
                        label="Placeholder (optional)"
                        fullWidth
                        value={b.placeholder || ""}
                        onChange={(e) =>
                          setBlankField(
                            b.blankId,
                            "placeholder",
                            e.target.value
                          )
                        }
                      />
                    </Box>

                    {b.inputType === "dropdown" && (
                      <Card variant="outlined" sx={{ p: 2, mb: 2 }}>
                        <Typography variant="subtitle2" className="mb-2">
                          Options
                        </Typography>
                        <Box className="space-y-2">
                          {(b.options || []).map((opt, idx) => (
                            <Box
                              key={idx}
                              className="grid grid-cols-12 gap-2 items-center"
                            >
                              <TextField
                                className="col-span-8"
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
                              />
                              <TextField
                                className="col-span-3"
                                label="Correct?"
                                value={opt.isCorrect ? "Yes" : "No"}
                                onClick={() =>
                                  setOptionField(
                                    b.blankId,
                                    idx,
                                    "isCorrect",
                                    !opt.isCorrect
                                  )
                                }
                                inputProps={{ readOnly: true }}
                              />
                              <IconButton
                                className="col-span-1"
                                size="small"
                                onClick={() => deleteOption(b.blankId, idx)}
                              >
                                <Delete fontSize="small" />
                              </IconButton>
                            </Box>
                          ))}
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => addOption(b.blankId)}
                            startIcon={<Add />}
                          >
                            Add Option
                          </Button>
                        </Box>
                      </Card>
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
                          : "Exact text match (case-sensitive for now)"
                      }
                    />
                  </CardContent>
                </Card>
              ))}
          </Box>
        </CardContent>
      </Card>

      <Box className="flex items-center gap-2">
        <Button variant="contained" onClick={handleSave} startIcon={<Save />}>
          Save Question
        </Button>
        <Button color="error" onClick={onDelete} startIcon={<Delete />}>
          Delete Question
        </Button>
      </Box>
    </Box>
  );
}
